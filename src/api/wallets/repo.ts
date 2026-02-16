import * as Db from '@/api/db'
import Wallet from './wallet'
import Creator from './creator'
import Fetcher from './fetcher'

export default class Repo {
  constructor(walletTable: Db.WalletTable) {
    this.walletTable = walletTable

    this.fetcher = new Fetcher({ walletTable })
  }

  async fetch() {
    let wallets
    wallets = await this.walletTable.toArray()
    wallets = wallets.map(
      (record) =>
        new Wallet({
          id: record.id,
          name: record.name,
          currencyCode: record.currencyCode,
        }),
    )
    return wallets
  }

  creator() {
    return new Creator({ walletTable: this.walletTable, fetcher: this.fetcher })
  }

  private walletTable: Db.WalletTable

  private fetcher: Fetcher
}
