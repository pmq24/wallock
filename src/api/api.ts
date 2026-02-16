import * as Db from '@/api/db'
import * as Wallets from '@/api/wallets'

export default class Api {
  constructor() {
    this.db = new Db.Db()
    this.wallets = new Wallets.Repo(this.db.wallets)
  }

  readonly wallets: Wallets.Repo

  private readonly db: Db.Db
}
