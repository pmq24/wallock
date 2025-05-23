import Category from './Category'
import * as v from 'valibot'
import { createStandardError, createStandardSuccess } from 'models/common'
import { nanoid } from 'nanoid'
import type { CategoryTable } from './dexie'
import type Hasher from 'models/sync/hashes/Hasher'

class CategoryService {
  constructor (params: { categoryTable: CategoryTable; hasher: Hasher }) {
    this.categoryTable = params.categoryTable
    this.hasher = params.hasher
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

  async byHashes (hashes: string[]) {
    return this.categoryTable
      .where('hash')
      .anyOf(hashes)
      .toArray()
      .then((records) => records.map((record) => new Category(record)))
  }

  async id (id: string) {
    return await this.categoryTable
      .get(id)
      .then((record) => (record ? new Category(record) : undefined))
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
    const hash = this.hasher.hashData(record)
    const id = await this.categoryTable.add({ ...record, hash })
    const category = await this.id(id)

    this.onCreateListeners.forEach((listener) => listener(category!))

    return createStandardSuccess(id)
  }

  addOnCreateListener (listener: CategoryService.OnCreateListener) {
    this.onCreateListeners.push(listener)
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

  private readonly onCreateListeners: CategoryService.OnCreateListener[] = []
}

namespace CategoryService {
  export type CreateData = {
    name: string;
    type: Category.Type;
  }
  export type CreateErrors = v.FlatErrors<
    Awaited<ReturnType<CategoryService['getSchema']>>
  >

  export type OnCreateListener = (category: Category) => void
}

export default CategoryService
