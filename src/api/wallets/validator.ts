import * as Db from '@/api/db'
import * as Currencies from './currencies'
import * as v from 'valibot'

export default class Validator {
  constructor(opts: { walletTable: Db.WalletTable }) {
    this.walletTable = opts.walletTable
  }

  async validate(data: unknown) {
    const names = (await this.walletTable.orderBy('name').uniqueKeys()) as string[]

    const schema = v.object({
      name: v.pipe(v.string(), v.trim(), v.minLength(1), v.notValues(names)),
      currencyCode: v.pipe(v.string(), v.trim(), v.values(Currencies.CODES)),
    })

    const result = v.safeParse(schema, data)
    if (result.success) {
      return { ok: true, data: result.output } as const
    } else {
      const error = v.flatten(result.issues)
      return { ok: false, error } as const
    }
  }

  private readonly walletTable: Db.WalletTable
}
