import { ValidationError } from 'models/data/errors'
import CategoryService from './CategoryService'
import type { CategoryTable } from './dexie'

class CategoryUpdater {
  constructor (params: {
    categoryService: CategoryService,
    categoryTable: CategoryTable,
    onUpdated: () => Promise<void>
  }) {
    this.categoryService = params.categoryService
    this.categoryTable = params.categoryTable
    this.onUpdateListener = params.onUpdated
  }

  async getUpdateData (id?: string) {
    const allCategories = await this.categoryService.getAll()
    const category = allCategories.find(c => c.id === id)

    if (!category) {
      return {
        updatable: false,
        reason: "Category doesn't exist",
        category
      } as const
    }

    if (category.isSystem) {
      return {
        updatable: false,
        reason: 'This is a system category',
        category
      } as const
    }

    return {
      updatable: true,
      category
    } as const
  }

  async update (data: CategoryUpdater.Data) {
    await this.validate(data)

    data.name = data.name.trim()

    await this.categoryTable.update(data.id, {
      name: data.name,
      parentId: data.parentId,
    })

    await this.onUpdateListener()
  }

  async validate (data: CategoryUpdater.Data) {
    const allCategories = await this.categoryService.getAll()

    const category = allCategories.find(c => c.id === data.id)

    if (!category) {
      throw new ValidationError<CategoryUpdater.Data>({
        id: "Doesn't exist"
      })
    }

    if (category.isSystem) {
      throw new ValidationError<CategoryUpdater.Data>({
        id: 'Cannot update system category'
      })
    }

    const subtreeCategoryIds = []
    const categoriesToCheck = [data.id]

    while (categoriesToCheck.length) {
      const currentId = categoriesToCheck.shift()!
      subtreeCategoryIds.push(currentId)
      const children = allCategories.filter(c => c.parentId === currentId)

      if (children.length) {
        categoriesToCheck.push(...children.map(c => c.id))
      }
    }

    if (subtreeCategoryIds.includes(data.parentId)) {
      throw new ValidationError<CategoryUpdater.Data>({
        parentId: "Can't be the parent of itself or its children"
      })
    }

    const ids = allCategories.map(c => c.id)

    if (!data.parentId || !ids.includes(data.parentId)) {
      throw new ValidationError<CategoryUpdater.Data>({
        parentId: "Parent doesn't exist"
      })
    }

    if (data.name.includes('/')) {
      throw new ValidationError<CategoryUpdater.Data>({
        name: 'Cannot contain slashes'
      })
    }

    const siblingNames = allCategories.filter(c => c.parentId === data.parentId).map(c => c.name)
    if (siblingNames.includes(data.name)) {
      throw new ValidationError<CategoryUpdater.Data>({
        name: 'Already exists'
      })
    }
  }

  private categoryService: CategoryService
  private categoryTable: CategoryTable
  private onUpdateListener: () => Promise<void>
}

namespace CategoryUpdater {
  export type Data = {
    id: string;
    name: string;
    parentId: string;
  }
  export type Error = ValidationError<Data>
}

export default CategoryUpdater
