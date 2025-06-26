import { ValidationError } from 'models/data/errors'
import Category from './Category'
import CategoryService from './CategoryService'
import * as v from 'valibot'
import type { CategoryTable } from './dexie'
import { createStandardError, createStandardSuccess } from 'models/common'
import type Hasher from 'models/sync/hashes/Hasher'
import { nanoid } from 'nanoid'

class CategoryCreator {
  constructor (params: {
    categoryService: CategoryService,
    categoryTable: CategoryTable,
    hasher: Hasher
  }) {
    this.categoryService = params.categoryService
    this.categoryTable = params.categoryTable
    this.hasher = params.hasher
  }

  createInitialData () {
    return {
      name: '',
      type: 'expense' as Category.Type
    }
  }

  async getErrorIfInvalid (data: CategoryCreator.Data) {
    let names
    names = await this.categoryService.getByType(data?.type)
    names = names.map(c => c.name)

    const schema = v.object({
      type: v.pipe(v.string(), v.values(Category.TYPES, "Must be either 'expense' or 'income'")),
      name: v.pipe(v.string(), v.minLength(1, 'Required'), v.notValues(names, 'Already exists')),
    })

    const result = v.safeParse(schema, data)
    if (!result.success) {
      const error = new ValidationError<CategoryCreator.Data>()
      const flattened = v.flatten(result.issues)
      error.setMultiple(flattened.nested)
      return error
    }
  }

  async throwErrorIfInvalid (data: CategoryCreator.Data) {
    const error = await this.getErrorIfInvalid(data)
    if (error) throw error
  }

  async submit (data: CategoryCreator.Data) {
    const error = await this.getErrorIfInvalid(data)

    if (error) {
      return createStandardError(error)
    }

    await this.createParentsIfNeeded(data)

    const record = {
      id: nanoid(),
      name: CategoryService.standardizeName(data.name),
      type: data.type
    }
    const hash = this.hasher.hashData(record)
    await this.categoryTable.add({ ...record, hash })

    return createStandardSuccess(undefined)
  }

  async submitOrThrow (data: CategoryCreator.Data) {
    const result = await this.submit(data)

    if (result.success) {
      return result.data
    } else {
      throw result.errors
    }
  }

  private async createParentsIfNeeded (data: CategoryCreator.Data) {
    const name = CategoryService.standardizeName(data.name)
    const groups = name.split('/')
    for (let i = 1; i < groups.length; i++) {
      const name = groups.slice(0, i).join('/')

      const category = await this.categoryService.getByNameAndType(name, data.type)
      if (category) continue

      await this.submitOrThrow({ type: data.type, name })
    }
  }

  private categoryService: CategoryService
  private categoryTable: CategoryTable
  private hasher: Hasher
}

namespace CategoryCreator {
  export type Data = {
    type: Category.Type;
    name: string;
  }
  export type Error = ValidationError<Data>
}

export default CategoryCreator
