import * as Categories from '@/api/categories';
import * as Wallets from '@/api/wallets';
import * as Db from '@/api/db';

export default class Fetcher {
  constructor(opts: { transactionTable: Db.TransactionTable, categoryFetcher: Categories.Fetcher, walletFetcher: Wallets.Fetcher }) {
    this.transactionTable = opts.transactionTable
    this.categoriesFetcher = opts.categoryFetcher
    this.walletsFetcher = opts.walletFetcher
  }

  private readonly transactionTable: Db.TransactionTable

  private readonly categoriesFetcher: Categories.Fetcher
  private readonly walletsFetcher: Wallets.Fetcher
}
