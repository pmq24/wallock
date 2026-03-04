import * as Db from '@/api/db'
import type Fetcher from './fetcher'
import * as v from 'valibot'
import i18n from '@/i18n'
import Util from '@/api/util'
import type { Wallet } from '.'

namespace Creator {
  export type CreateData = {
    name: string
  }

  export type CreateError = Record<keyof CreateData, string | undefined>
}

class Creator {
  constructor(opts: { walletTable: Db.WalletTable; fetcher: Fetcher }) {
    this.walletTable = opts.walletTable
    this.fetcher = opts.fetcher
  }

  async validate(data: Creator.CreateData): Promise<Util.Result<Creator.CreateData, Creator.CreateError>> {
    const names = await this.fetcher.allNames()

    const schema = v.object({
      name: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1),
        v.notValues(names, i18n.t('wallets.props.name.errors.alreadyExists')),
      ),
    })

    const result = v.safeParse(schema, data)
    if (!result.success) {
      const error = v.flatten(result.issues)
      return {
        ok: false,
        data: undefined,
        error: {
          name: error.nested?.name?.at(0)
        }
      } as const
    } else {
      return {
        ok: true,
        data: result.output,
        error: undefined,
      } as const
    }
  }

  async create(data: Creator.CreateData): Promise<Util.Result<Wallet, Creator.CreateError>> {
    const { ok, data: d, error } = await this.validate(data)

    if (!ok) {
      return { ok: false, error, data: undefined } as const
    }

    const id = await this.walletTable.add({
      id: Date.now(),
      name: d.name,
    })

    const wallet = (await this.fetcher.byId(id))!

    return { ok: true, data: wallet, error: undefined } as const
  }

  private readonly walletTable: Db.WalletTable
  private readonly fetcher: Fetcher
}

export default Creator
