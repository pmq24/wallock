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
      descriptionFor.member<CategoryService>('getAll'),
      () => {
        beforeEach(async () => {
          const mockCategoriesData: CategoryService.CreateData[] = [
            { name: 'Salary', type: 'income' },
            { name: 'Groceries', type: 'expense' },
            { name: 'House rental', type: 'expense' },
            { name: 'Investments', type: 'income' },
          ]
          for (const data of mockCategoriesData) {
            const result = await service.create(data)
            if (!result.success) {
              throw new Error(`Failed to mock category: ${result.errors}`)
            }
          }
        })

        describe(descriptionFor.returns(), async () => {
          it('Sort order: by type (expense > income), then by name alphabetically', async () => {
            const returnedData = await service.getAll()
            expect(returnedData.map((c) => c.name)).toStrictEqual([
              'Groceries',
              'House rental',
              'Investments',
              'Salary',
            ])
          })
        })
      })
  })
