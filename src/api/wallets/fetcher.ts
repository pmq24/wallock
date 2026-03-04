import * as Db from '@/api/db'
import { Wallet } from '.'

export default class Fetcher {
  constructor(opts: { walletTable: Db.WalletTable }) {
    this.walletTable = opts.walletTable
  }

  async byId(id: number) {
    const record = await this.walletTable.get(id)

    if (!record) {
      return undefined
    }

    return new Wallet(record)
  }

  async allNames() {
    return (await this.walletTable.orderBy('name').uniqueKeys()) as string[]
  }

  async all() {
    let records
    records = await this.walletTable.toArray()
    records = records.map((record) => new Wallet(record))
    return records
  }

  private walletTable: Db.WalletTable
}
