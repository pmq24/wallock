import { useAsyncState } from '@vueuse/core'
import type Category from 'models/data/categories/Category'
import { injectApi } from 'providers/api'
import type { Ref } from 'vue'

export function useCategoriesByType (opts: { type: Ref<Category.Type> }) {
  const api = injectApi()
  const categoryService = api.categoryService

  const { state: categories, isReady, execute: refetchCategories } = useAsyncState(
    () => categoryService.getAll().then(categories => categories.filter(category => category.type === opts.type.value)),
    [],
    {
      immediate: false
    }
  )

  return { categories, isReady, refetchCategories }
}
