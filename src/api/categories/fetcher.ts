import * as Db from '@/api/db'
import Category from './category'

export default class Fetcher {
  constructor(opts: { categoryTable: Db.CategoryTable }) {
    this.categoryTable = opts.categoryTable
  }

  all() {
    return Array.from(this.categoryMap.values())
  }

  byId(id: number) {
    return this.categoryMap.get(id)
  }

  root() {
    return this.all().filter((category) => category.parentId === undefined)
  }

  childrenOf(parentId: number) {
    return this.all().filter((category) => category.parentId === parentId)
  }

  async reloadCategoryMap() {
    this.categoryMap.clear()
    const records = await this.categoryTable.toArray()
    for (const record of records) {
      this.categoryMap.set(record.id, new Category({ ...record, fetcher: this }))
    }
  }

  private readonly categoryTable: Db.CategoryTable
  private readonly categoryMap: Map<number, Category> = new Map()
}
