import { ValidationError } from 'models/data/errors'
import CategoryService from './CategoryService'
import type { CategoryTable } from './dexie'
import { nanoid } from 'nanoid'
import * as v from 'valibot'
import { ERRORS } from './constants'

class CategoryCreator {
  constructor (params: {
    categoryService: CategoryService,
    categoryTable: CategoryTable,
    onCreated: () => Promise<void>
  }) {
    this.categoryService = params.categoryService
    this.categoryTable = params.categoryTable
    this.onCreateListener = params.onCreated
  }

  async create (data: CategoryCreator.Data) {
    await this.validate(data)

    data.name = data.name.trim()

    await this.categoryTable.add({
      id: nanoid(),
      name: data.name,
      parentId: data.parentId,
    })

    await this.onCreateListener()
  }

  private async validate (data: CategoryCreator.Data) {
    const allCategories = await this.categoryService.getAll()
    const ids = allCategories.map(c => c.id)
    const siblingNames = allCategories.filter(c => c.parentId === data.parentId).map(c => c.name)

    const schema = v.object({
      parentId: v.pipe(
        v.string(),
        v.values(ids, ERRORS.PARENT_DOESNT_EXIST)
      ),
      name: v.pipe(
        v.string(),
        v.minLength(1, ERRORS.NAME_IS_REQUIRED),
        v.excludes('/', ERRORS.NAME_CANNOT_CONTAIN_SLASHES),
        v.notValues(siblingNames, ERRORS.NAME_ALREADY_EXISTS)
      )
    })

    const validation = v.safeParse(schema, data)
    if (validation.success) {
      return
    }

    throw new ValidationError(v.flatten(validation.issues).nested)
  }

  private categoryService: CategoryService
  private categoryTable: CategoryTable
  private onCreateListener: () => Promise<void>
}

namespace CategoryCreator {
  export type Data = {
    name: string;
    parentId: string;
  }
  export type Error = ValidationError<Data>
}

export default CategoryCreator
