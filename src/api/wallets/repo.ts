import * as Db from '@/api/db'
import Creator from './creator'
import Fetcher from './fetcher'

export default class Repo {
  constructor(walletTable: Db.WalletTable) {
    this.fetcher = new Fetcher({ walletTable })
    this.creator = new Creator({ walletTable, fetcher: this.fetcher })
  }

  readonly fetcher: Fetcher
  readonly creator: Creator
}
