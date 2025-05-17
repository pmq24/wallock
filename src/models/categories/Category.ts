import type { CategoryRecord } from './dexie'

class Category {
  static TYPES = ['income', 'expense'] as const

  constructor (record: CategoryRecord) {
    this.id = record.id
    this.name = record.name
    this.type = record.type
  }

  get isExpense () {
    return this.type === 'expense'
  }

  get isIncome () {
    return this.type === 'income'
  }

  public readonly id: string
  public readonly name: string
  public readonly type: Category.Type
}

namespace Category {
  export type Type = (typeof Category.TYPES)[number]
}

export default Category
