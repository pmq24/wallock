import type { AppDexie } from 'models/dexie'
import Category from './Category'
import * as v from 'valibot'
import { createStandardError, createStandardSuccess } from 'models/common'
import { nanoid } from 'nanoid'

class CategoryService {
  constructor (private dexie: AppDexie) {}

  async all () {
    return this.dexie.categories.toArray().then((categoryRecords) =>
      categoryRecords
        .sort((categoryRecord1, categoryRecord2) => {
          if (categoryRecord1.type !== categoryRecord2.type) {
            if (categoryRecord1.type === 'expense') {
              return -1
            } else {
              return 1
            }
          } else {
            if (categoryRecord1.name < categoryRecord2.name) {
              return -1
            } else {
              return 1
            }
          }
        })
        .map(
          (categoryRecord) =>
            new Category(
              categoryRecord.id,
              categoryRecord.name,
              categoryRecord.type
            )
        )
    )
  }

  async create (data: CategoryService.CreateData) {
    const validation = v.safeParse(await this.getSchema(), data)

    if (!validation.success) {
      const errors = v.flatten(validation.issues)
      return createStandardError(errors)
    }

    const id = await this.dexie.categories.add({
      id: nanoid(),
      type: validation.output.type as Category.Type,
      name: validation.output.name,
    })

    return createStandardSuccess(id)
  }

  async getSchema () {
    const names = (await this.dexie.categories
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
