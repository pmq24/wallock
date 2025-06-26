import { beforeEach, describe, expect, it } from 'vitest'
import { descriptionFor, mockDexie } from 'models/test-common'
import Hasher from 'models/sync/hashes/Hasher'
import CategoryCreator from '../CategoryCreator'
import CategoryService from '../CategoryService'
import type Category from '../Category'
import type { AppDexie } from 'models/dexie'

describe(
  descriptionFor.class('CategoryCreator'),
  () => {
    let dexie: AppDexie
    let creator: CategoryCreator

    beforeEach(async () => {
      dexie = mockDexie()
      const hasher = new Hasher()
      const categoryService = new CategoryService({ categoryTable: dexie.categories, hasher })

      creator = new CategoryCreator({
        categoryService,
        categoryTable: dexie.categories,
        hasher
      })
    })

    describe(
      descriptionFor.method('submit'),
      () => {
        it(descriptionFor.scenario('type is empty'), async () => {
          const result = await creator.submit({ type: undefined as any, name: '' })
          expect(result.success).toBe(false)
          expect(result.errors?.get('type')).toBeDefined()
        })
        it(descriptionFor.scenario("type is neither 'expense' or 'income'"), async () => {
          const result = await creator.submit({ type: 'something else' as any, name: '' })
          expect(result.success).toBe(false)
          expect(result.errors?.get('type')).toBeDefined()
        })

        it(descriptionFor.scenario('name is empty'), async () => {
          const result = await creator.submit({ type: 'expense' as any, name: '' })
          expect(result.success).toBe(false)
          expect(result.errors?.get('name')).toBeDefined()
        })
        it(descriptionFor.scenario('name already exists'), async () => {
          const data = { type: 'expense' as Category.Type, name: 'Rental' }
          await creator.submitOrThrow(data)
          const result = await creator.submit(data)
          expect(result.success).toBe(false)
          expect(result.errors?.get('name')).toBeDefined()
        })

        it(descriptionFor.scenario("name is 'a/b/c' and 'a' and 'b' don't exist"), async () => {
          const data = { type: 'expense' as Category.Type, name: 'a/b/c' }

          const beforeCount = await dexie.categories.count()

          const result = await creator.submit(data)
          expect(result.success).toBe(true)

          const afterCount = await dexie.categories.count()
          expect(afterCount).toBe(beforeCount + 3)
        })

        it(descriptionFor.scenario("name is 'a/b/c' but 'a' already exists"), async () => {
          await creator.submitOrThrow({ type: 'expense' as Category.Type, name: 'a' })

          const beforeCount = await dexie.categories.count()

          const result = await creator.submit({ type: 'expense' as Category.Type, name: 'a/b/c' })
          expect(result.success).toBe(true)

          const afterCount = await dexie.categories.count()
          expect(afterCount).toBe(beforeCount + 2)
        })
      }
    )
  })
