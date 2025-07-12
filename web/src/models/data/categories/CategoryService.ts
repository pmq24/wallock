import Category from './Category'
import type { CategoryTable } from './dexie'
import CategoryCreator from './CategoryCreator'
import CategoryUpdater from './CategoryUpdater'

class CategoryService {
  constructor (params: { categoryTable: CategoryTable }) {
    this.categoryTable = params.categoryTable

    this.creator = new CategoryCreator({
      categoryService: this,
      categoryTable: this.categoryTable,
      onCreated: async () => { this.allCategories = [] }
    })

    this.updater = new CategoryUpdater({
      categoryService: this,
      categoryTable: this.categoryTable,
      onUpdated: async () => { this.allCategories = [] }
    })
  }

  public readonly creator: CategoryCreator
  public readonly updater: CategoryUpdater

  async getAll () {
    if (this.allCategories.length === 0) {
      await this.reloadAllCategories()
    }
    return this.allCategories
  }

  async getByType (type: Category.Type) {
    let c
    c = await this.getAll()
    c = c.filter(c => c.type === type)
    return c
  }

  async getById (id: string) {
    let c
    c = await this.getAll()
    c = c.find(c => c.id === id)
    return c
  }

  async getByFullName (fullName: string) {
    let c
    c = await this.getAll()
    c = c.find(c => c.fullName === fullName)
    return c
  }

  private async reloadAllCategories () {
    const queue = await this.categoryTable.toArray()

    while (queue.length) {
      const record = queue.shift()!
      const isSystem = record.parentId === ''
      const parent = this.allCategories.find(c => c.id === record.parentId)

      if (isSystem || parent) {
        const c = new Category({ ...record, parent })
        this.allCategories.push(c)
      } else {
        queue.push(record)
      }
    }
  }

  private readonly categoryTable: CategoryTable

  private allCategories: Category[] = []
}

export default CategoryService
