import Category from './Category'
import * as v from 'valibot'
import { createStandardError, createStandardSuccess } from 'models/common'
import { nanoid } from 'nanoid'
import type Api from 'models/api'
import type { CategoryTable } from './dexie'

class CategoryService {
  constructor (params: { api: Api }) {
    this.categoryTable = params.api.dexie.categories
  }

  async all () {
    return this.categoryTable.toArray().then((categoryRecords) =>
      categoryRecords
        .sort((a, b) => {
          return a.type === b.type
            ? a.name.localeCompare(b.name)
            : a.type === 'expense'
              ? -1
              : 1
        })
        .map((categoryRecord) => new Category(categoryRecord))
    )
  }

  async create (data: CategoryService.CreateData) {
    const validation = v.safeParse(await this.getSchema(), data)

    if (!validation.success) {
      const errors = v.flatten(validation.issues)
      return createStandardError(errors)
    }

    const id = await this.categoryTable.add({
      id: nanoid(),
      type: validation.output.type as Category.Type,
      name: validation.output.name,
    })

    return createStandardSuccess(id)
  }

  async getSchema () {
    const names = (await this.categoryTable
      .orderBy('name')
      .uniqueKeys()) as string[]

    return v.object({
      name: v.pipe(
        v.string(),
        v.minLength(1, 'Required'),
        v.notValues(names, 'Already exists')
      ),
      type: v.pipe(v.string(), v.values(Category.TYPES, 'Invalid type')),
    })
  }

  private readonly categoryTable: CategoryTable
}

namespace CategoryService {
  export type CreateData = {
    name: string;
    type: Category.Type;
  }
  export type CreateErrors = v.FlatErrors<
    Awaited<ReturnType<CategoryService['getSchema']>>
  >
}

export default CategoryService
