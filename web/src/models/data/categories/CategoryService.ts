import Category from './Category'
import * as v from 'valibot'
import { createStandardError, createStandardSuccess } from 'models/common'
import { nanoid } from 'nanoid'
import type { CategoryTable } from './dexie'
import CategoryUpdateForm from './CategoryUpdateForm'
import CategoryCreator from './CategoryCreator'

class CategoryService {
  static standardizeName (name: string) {
    if (name.startsWith('/')) name = name.slice(1)
    if (name.endsWith('/')) name = name.slice(0, -1)
    return name.split('/').map(s => s.trim()).join('/')
  }

  constructor (params: { categoryTable: CategoryTable }) {
    this.categoryTable = params.categoryTable

    this.creator = new CategoryCreator({
      categoryService: this,
      categoryTable: this.categoryTable,
    })
  }

  public readonly creator: CategoryCreator

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

  async getByType (type: Category.Type) {
    let records
    records = await this.getAll()
    records = records.filter(r => r.type === type)
    return records.map(r => new Category(r))
  }

  async getByNameAndType (name: string, type: Category.Type) {
    const record = await this.categoryTable.get({ name, type })
    return record ? new Category(record) : undefined
  }

  async getById (id: string) {
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
    const id = await this.categoryTable.add(record)

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
