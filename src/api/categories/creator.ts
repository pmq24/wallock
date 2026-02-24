import * as Db from '@/api/db'
import Category from './category'
import Validator from './validator'
import Fetcher from './fetcher'

export default class Creator {
  constructor(opts: { categoryTable: Db.CategoryTable; fetcher: Fetcher }) {
    this.categoryTable = opts.categoryTable
    this.fetcher = opts.fetcher
    this.validator = new Validator({ fetcher: this.fetcher })
  }

  validate() {
    return this.validator.validate({
      name: this.name,
      parentId: this.parentId,
    })
  }

  async save() {
    const { ok, data, error } = this.validate()

    if (ok) {
      const id = await this.categoryTable.add({
        id: Date.now(),
        name: data.name,
        parentId: data.parentId,
        readonly: false,
      })

      const category = new Category({
        id,
        name: data.name,
        parentId: data.parentId,
        readonly: false,
        fetcher: this.fetcher,
      })

      await this.fetcher.reloadCategoryMap()

      this.name = ''
      this.parentId = undefined

      return { ok: true, category } as const
    } else {
      return { ok: false, error } as const
    }
  }

  name: string = ''
  parentId?: number

  private readonly categoryTable: Db.CategoryTable
  private readonly fetcher: Fetcher
  private readonly validator: Validator
}
