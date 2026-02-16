import * as Db from '@/api/db'
import Wallet from './wallet'

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

  private walletTable: Db.WalletTable
}
