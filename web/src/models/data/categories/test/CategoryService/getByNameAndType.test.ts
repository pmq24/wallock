import { beforeEach, describe, expect, it } from 'vitest'
import CategoryService from '../../CategoryService'
import { descriptionFor, mockDexie } from 'models/test-common'
import Category from '../../Category'

describe(
  descriptionFor.class('CategoryService'),
  () => {
    let service: CategoryService
    let categoryName: string
    let categoryType: Category.Type

    beforeEach(async () => {
      const dexie = mockDexie()

      service = new CategoryService({
        categoryTable: dexie.categories,
      })

      categoryName = 'Salary'
      categoryType = 'income'

      const result = await service.create({
        name: categoryName,
        type: categoryType
      })

      if (!result.success) {
        throw new Error(`Failed to mock category: ${result.errors}`)
      }
    })

    describe(
      descriptionFor.member<CategoryService>('getByNameAndType'),
      () => {
        describe(descriptionFor.scenario('name and type both match'), () => {
          it(descriptionFor.returns('the correct category'), async () => {
            const category = await service.getByNameAndType(categoryName, categoryType)
            expect(category).toBeInstanceOf(Category)
            expect(category?.name).toBe(categoryName)
            expect(category?.type).toBe(categoryType)
          })
        })

        describe(descriptionFor.scenario('name matches but type does not'), () => {
          it(descriptionFor.returns('undefined'), async () => {
            const category = await service.getByNameAndType(categoryName, 'expense')
            expect(category).toBeUndefined()
          })
        })

        describe(descriptionFor.scenario('name does not match but type does'), () => {
          it(descriptionFor.returns('undefined'), async () => {
            const category = await service.getByNameAndType('NonExistentCategory', categoryType)
            expect(category).toBeUndefined()
          })
        })

        describe(descriptionFor.scenario('neither name nor type match'), () => {
          it(descriptionFor.returns('undefined'), async () => {
            const category = await service.getByNameAndType('NonExistentCategory', 'expense')
            expect(category).toBeUndefined()
          })
        })
      }
    )
  }
)
