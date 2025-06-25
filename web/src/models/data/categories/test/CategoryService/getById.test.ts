import { beforeEach, describe, expect, it } from 'vitest'
import CategoryService from '../../CategoryService'
import { descriptionFor, mockDexie } from 'models/test-common'
import Hasher from 'models/sync/hashes/Hasher'
import Category from '../../Category'

describe(
  descriptionFor.class('CategoryService'),
  () => {
    let service: CategoryService
    let categoryId: string

    beforeEach(async () => {
      const dexie = mockDexie()
      const hasher = new Hasher()

      service = new CategoryService({
        categoryTable: dexie.categories,
        hasher,
      })

      const result = await service.create({
        name: 'Salary',
        type: 'income'
      })

      if (result.success) {
        categoryId = result.data
      } else {
        throw new Error(`Failed to mock category: ${result.errors}`)
      }
    })

    describe(
      descriptionFor.member<CategoryService>('getById'),
      () => {
        describe(descriptionFor.scenario('id exists'), async () => {
          it(descriptionFor.returns('the correct category'), async () => {
            const c = await service.getById(categoryId)
            expect(c).toBeInstanceOf(Category)
          })
        })

        describe(descriptionFor.scenario("id doesn't exist"), async () => {
          it(descriptionFor.returns('undefined'), async () => {
            const c = await service.getById('invalidId')
            expect(c).toBeUndefined()
          })
        })
      }
    )
  })
