import Category from './Category'
import * as v from 'valibot'
import { createStandardError, createStandardSuccess } from 'models/common'
import { nanoid } from 'nanoid'
import type Api from 'models/api'
import type { CategoryTable } from './dexie'
import type Hasher from 'models/sync/Hasher'

class CategoryService {
  constructor (params: { api: Api }) {
    this.categoryTable = params.api.dexie.categories
    this.hasher = params.api.hasher
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

    const record = {
      id: nanoid(),
      type: validation.output.type as Category.Type,
      name: validation.output.name,
    }
    const hash = await this.hasher.hashData(record)
    const id = await this.categoryTable.add({ ...record, hash })

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
  private readonly hasher: Hasher
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
