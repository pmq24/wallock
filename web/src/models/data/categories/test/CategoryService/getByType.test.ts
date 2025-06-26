import { beforeEach, describe, expect, it } from 'vitest'
import CategoryService from '../../CategoryService'
import { descriptionFor, mockDexie } from 'models/test-common'

describe(
  descriptionFor.class('CategoryService'),
  () => {
    let service: CategoryService

    beforeEach(async () => {
      const dexie = mockDexie()

      service = new CategoryService({
        categoryTable: dexie.categories,
      })
    })

    describe(
      descriptionFor.member<CategoryService>('getByType'),
      () => {
        beforeEach(async () => {
          const mockCategoriesData: CategoryService.CreateData[] = [
            { name: 'Salary', type: 'income' },
            { name: 'Freelance', type: 'income' },
            { name: 'Groceries', type: 'expense' },
            { name: 'House rental', type: 'expense' },
            { name: 'Transportation', type: 'expense' },
          ]
          for (const data of mockCategoriesData) {
            const result = await service.create(data)
            if (!result.success) {
              throw new Error(`Failed to mock category: ${result.errors}`)
            }
          }
        })

        describe(descriptionFor.scenario("type is 'expense'"), () => {
          it(descriptionFor.returns('all expense categories'), async () => {
            const c = await service.getByType('expense')

            expect(c).toHaveLength(3)

            c.forEach(category => {
              expect(category.type).toBe('expense')
            })
          })
        })

        describe(descriptionFor.scenario("type is 'income'"), () => {
          it(descriptionFor.returns('all income categories'), async () => {
            const c = await service.getByType('income')

            expect(c).toHaveLength(2)

            c.forEach(category => {
              expect(category.type).toBe('income')
            })
          })
        })
      }
    )
  })
