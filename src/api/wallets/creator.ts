import * as Db from '@/api/db'
import * as Currencies from './currencies'
import Validator from './validator'
import type Fetcher from './fetcher'

export default class Creator {
  constructor(opts: { walletTable: Db.WalletTable; fetcher: Fetcher }) {
    this.walletTable = opts.walletTable
    this.fetcher = opts.fetcher
    this.validator = new Validator({ walletTable: this.walletTable })
  }

  async validate() {
    return this.validator.validate({
      name: this.name,
      currencyCode: this.currencyCode,
    })
  }

  async save() {
    const { ok, data, error } = await this.validate()

    if (ok) {
      const id = await this.walletTable.add({
        id: Date.now(),
        name: data.name,
        currencyCode: data.currencyCode,
      })

      const wallet = (await this.fetcher.byId(id))!

      return { ok: true, wallet } as const
    } else {
      return { ok: false, error } as const
    }
  }

  name: string = ''
  currencyCode: Currencies.Code = 'USD'

  private readonly walletTable: Db.WalletTable
  private readonly fetcher: Fetcher
  private readonly validator: Validator
}
