import * as Db from '@/api/db'
import * as Wallets from '@/api/wallets'
import * as Categories from '@/api/categories'

export default class Api {
  constructor() {
    this.db = new Db.Db()
    this.wallets = new Wallets.Repo(this.db.wallets)
    this.categories = new Categories.Repo(this.db.categories)
  }

  async init() {
    await this.categories.init()
  }

  readonly wallets: Wallets.Repo
  readonly categories: Categories.Repo

  private readonly db: Db.Db
}
