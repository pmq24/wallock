import { beforeEach, describe, expect, it } from 'vitest'
import CategoryService from '../../CategoryService'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import Api from 'models/api'

describe('CategoryService - all', () => {
  let service: CategoryService

  beforeEach(() => {
    const api = new Api({
      dexieOpts: { indexedDB: new IDBFactory(), IDBKeyRange },
    })
    service = new CategoryService({
      categoryTable: api.dexie.categories,
      hasher: api.hasher,
    })
  })

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

  it('returns categories, sorted by type (expense -> income), then by name alphabetically', async () => {
    const result = await service.all()

    expect(result.map((c) => c.name)).toStrictEqual([
      'Groceries',
      'House rental',
      'Investments',
      'Salary',
    ])
  })
})
