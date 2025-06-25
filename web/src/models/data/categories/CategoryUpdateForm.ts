import type Hasher from 'models/sync/hashes/Hasher'
import type { CategoryRecord, CategoryTable } from './dexie'
import { NotFoundError, ValidationError } from 'models/data/errors'
import type Category from './Category'
import CategoryService from './CategoryService'

class CategoryUpdateForm {
  static async create (params: { id: string; categoryTable: CategoryTable; categoryService: CategoryService; hasher: Hasher, onSuccess?: () => void }) {
    const record = await params.categoryTable.get(params.id)

    if (!record) {
      throw new NotFoundError('Category', params.id)
    }

    return new CategoryUpdateForm({
      record,
      categoryTable: params.categoryTable,
      categoryService: params.categoryService,
      hasher: params.hasher,
      onSuccess: params.onSuccess
    })
  }

  readonly id: string
  readonly type: Category.Type
  name: string
  readonly _oldName: string

  async submit () {
    try {
      this._isSubmitting = true
      this.name = CategoryService.standardizeName(this.name)

      let names
      names = await this.getAllNamesOfSameType()
      names = names.filter(n => n !== this._oldName)

      if (names.includes(this.name)) {
        throw new ValidationError({ name: 'Already exists' })
      }

      const groups = this.name.split('/')
      for (let i = 0; i < groups.length - 1; i++) {
        const name = groups.slice(0, i).join('/')

        const c = await this.categoryService.findByNameAndType(name, this.type)
        if (!c) {
          await this.categoryService.create({ name, type: this.type })
        }
      }

      await this.categoryTable.update(this.id, {
        name: this.name,
        type: this.type,
        hash: this.hasher.hashData({ id: this.id, name: this.name, type: this.type })
      })

      let subCategoriesToUpdate
      subCategoriesToUpdate = await this.categoryService.getAll()
      subCategoriesToUpdate = subCategoriesToUpdate
        .filter(c => c.name.startsWith(this._oldName + '/'))
        .map(c => ({
          key: c.id,
          changes: {
            name: c.name.replace(this._oldName, this.name),
          }
        }))

      await this.categoryTable.bulkUpdate(subCategoriesToUpdate)
      if (this.onSuccess) this.onSuccess()
    } finally {
      this._isSubmitting = false
    }
  }

  get isSubmitting () {
    return this._isSubmitting
  }

  private constructor (params: { record: CategoryRecord; categoryTable: CategoryTable; categoryService: CategoryService; hasher: Hasher, onSuccess?: () => void }) {
    this.categoryTable = params.categoryTable
    this.categoryService = params.categoryService
    this.hasher = params.hasher
    this.categoryService = params.categoryService
    this.onSuccess = params.onSuccess

    this.id = params.record.id
    this.name = params.record.name
    this.type = params.record.type
    this._oldName = params.record.name
  }

  private async getAllNamesOfSameType () {
    const categories = await this.categoryService.getAll()
    return categories.filter(c => c.type === this.type).map(c => c.name)
  }

  private readonly categoryTable: CategoryTable
  private readonly categoryService: CategoryService
  private readonly hasher: Hasher
  private readonly onSuccess?: () => void

  private _isSubmitting: boolean = false
}

namespace CategoryUpdateForm {
  export type Data = {
    id: string;
    name: string;
  }
}

export default CategoryUpdateForm
