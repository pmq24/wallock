import * as Db from '@/api/db'
import Creator from './creator'
import Fetcher from './fetcher'

export default class Repo {
  constructor(categoryTable: Db.CategoryTable) {
    this.categoryTable = categoryTable

    this.fetcher = new Fetcher({ categoryTable })
  }

  async init() {
    await this.fetcher.reloadCategoryMap()
  }

  creator() {
    return new Creator({ categoryTable: this.categoryTable, fetcher: this.fetcher })
  }

  readonly fetcher: Fetcher

  private categoryTable: Db.CategoryTable
}
