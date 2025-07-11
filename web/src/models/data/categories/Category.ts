import { PanicError } from 'models/common'
import type { CategoryRecord } from './dexie'

class Category {
  static readonly TYPES = ['income', 'expense'] as const

  constructor (opts: Category.ConstructorOpts) {
    this.id = opts.id
    this.name = opts.name
    this.parentId = opts.parentId
    this.parent = opts.parent
  }

  get fullName () {
    if (this.isSystem) {
      return this.name
    }

    const hierarchy = [this.name]

    let category = this.parent
    while (category) {
      hierarchy.push(category.name)
      category = category.parent
    }

    return hierarchy.reverse().join('/')
  }

  get type (): Category.Type {
    let id

    if (this.isSystem) {
      id = this.id
    } else {
      let category = this.parent
      while (category?.parent) {
        category = category.parent
      }

      id = category?.id
    }

    switch (id) {
      case 'income': return 'income'
      case 'expense': return 'expense'
      default: throw new PanicError('Root category has invalid type: ' + id)
    }
  }

  get isExpense () {
    return this.type === 'expense'
  }

  get isIncome () {
    return this.type === 'income'
  }

  get isSystem () {
    return this.parentId === ''
  }

  public readonly id: string
  public readonly name: string
  public readonly parentId: string
  public readonly parent?: Category
}

namespace Category {
  export type ConstructorOpts = CategoryRecord & {
    parent: Category | undefined
  }

  export type Type = typeof Category.TYPES[number]
}

export default Category
