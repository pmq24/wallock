class Category {
  static TYPES = ['income', 'expense'] as const

  constructor (
    public readonly id: string,
    public readonly name: string,
    public readonly type: Category.Type
  ) {}
}

namespace Category {
  export type Type = (typeof Category.TYPES)[number]
}

export default Category
