import type { CategoryRecord } from './dexie'

class Category {
  static TYPES = ['income', 'expense'] as const

  constructor (record: CategoryRecord) {
    this.id = record.id
    this.name = record.name
    this.type = record.type
    this.hash = record.hash
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
  public readonly hash: string
}

namespace Category {
  export type Type = (typeof Category.TYPES)[number]
}

export default Category
