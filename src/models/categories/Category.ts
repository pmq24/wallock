class Category {
  static TYPES = ['income', 'expense'] as const
}

namespace Category {
  export type Type = (typeof Category.TYPES)[number]
}

export default Category
