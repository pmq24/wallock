import * as Db from '@/api/db'
import type Fetcher from './fetcher'
import * as v from 'valibot'
import * as Currencies from './currencies';
import i18n from '@/i18n'

class Creator {
  constructor(opts: { walletTable: Db.WalletTable; fetcher: Fetcher }) {
    this.walletTable = opts.walletTable
    this.fetcher = opts.fetcher
  }

  async validate(data: Creator.CreateData) {
    const names = await this.fetcher.allNames()

    const schema = v.object({
      name: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1),
        v.notValues(names, i18n.t('wallets.props.name.errors.alreadyExists')),
      ),
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

  async create(data: Creator.CreateData) {
    const { ok, data: d, error } = await this.validate(data)

    if (ok) {
      const id = await this.walletTable.add({
        id: Date.now(),
        name: d.name,
        currencyCode: d.currencyCode,
      })

      const wallet = (await this.fetcher.byId(id))!

      return { ok: true, wallet } as const
    } else {
      return { ok: false, error } as const
    }
  }

  private readonly walletTable: Db.WalletTable
  private readonly fetcher: Fetcher
}

namespace Creator {
  export type CreateData = {
    name: string
    currencyCode: string
  }
}

export default Creator
