import Category from './Category'
import * as v from 'valibot'
import { createStandardError, createStandardSuccess } from 'models/common'
import { nanoid } from 'nanoid'
import type { CategoryTable } from './dexie'
import type Hasher from 'models/sync/hashes/Hasher'
import CategoryUpdateForm from './CategoryUpdateForm'

class CategoryService {
  static standardizeName (name: string) {
    if (name.startsWith('/')) name = name.slice(1)
    if (name.endsWith('/')) name = name.slice(0, -1)
    return name.split('/').map(s => s.trim()).join('/')
  }

  constructor (params: { categoryTable: CategoryTable; hasher: Hasher }) {
    this.categoryTable = params.categoryTable
    this.hasher = params.hasher
  }

  async getAll () {
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

  async findByNameAndType (name: string, type: Category.Type) {
    const record = await this.categoryTable.get({ name, type })
    return record ? new Category(record) : undefined
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

    this.notifyOnChangeListener()
    return createStandardSuccess(id)
  }

  addOnChangeListener (listener: CategoryService.OnChangeListener) {
    this.onChangeListeners.push(listener)
  }

  async createUpdateForm (id: string) {
    return CategoryUpdateForm.create({
      id,
      categoryTable: this.categoryTable,
      categoryService: this,
      hasher: this.hasher,
      onSuccess: () => this.notifyOnChangeListener()

    })
  }

  async getSchema () {
    const names = await this.allNames()

    return v.object({
      name: v.pipe(
        v.string(),
        v.minLength(1, 'Required'),
        v.notValues(names, 'Already exists')
      ),
      type: v.pipe(v.string(), v.values(Category.TYPES, 'Invalid type')),
    })
  }

  private notifyOnChangeListener () {
    this.onChangeListeners.forEach((listener) => listener())
  }

  private async allNames () {
    return (await this.categoryTable
      .orderBy('name')
      .uniqueKeys()) as string[]
  }

  private readonly categoryTable: CategoryTable
  private readonly hasher: Hasher

  private readonly onChangeListeners: CategoryService.OnChangeListener[] = []
}

namespace CategoryService {
  export type CreateData = {
    name: string;
    type: Category.Type;
  }
  export type CreateErrors = v.FlatErrors<
    Awaited<ReturnType<CategoryService['getSchema']>>
  >

  export type OnChangeListener = () => void
}

export default CategoryService
