import { beforeEach, describe, expect, it } from 'vitest'
import CategoryService from '../../CategoryService'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { type AppDexie } from 'models/dexie'
import Api from 'models/api'

describe('CategoryService - create', () => {
  let dexie: AppDexie
  let service: CategoryService

  beforeEach(() => {
    const api = new Api({
      dexieOpts: { indexedDB: new IDBFactory(), IDBKeyRange },
    })

    dexie = api.dexie
    service = new CategoryService({
      categoryTable: api.dexie.categories,
    })
  })

  describe('when data is valid', () => {
    it('creates an income category', async () => {
      const data: CategoryService.CreateData = {
        name: 'Salary',
        type: 'income',
      }
      const result = await service.create(data)

      expect(result.success).toBe(true)

      const categoryCount = await dexie.categories.count()
      expect(categoryCount).toBe(1)

      const category = (await dexie.categories.toArray()).at(0)
      expect(category).toBeDefined()
      expect(category?.name).toBe('Salary')
      expect(category?.type).toBe('income')
      expect(category?.id).toBeDefined()
    })

    it('creates an expense category', async () => {
      const data: CategoryService.CreateData = {
        name: 'Groceries',
        type: 'expense',
      }
      const result = await service.create(data)

      expect(result.success).toBe(true)

      const categoryCount = await dexie.categories.count()
      expect(categoryCount).toBe(1)

      const category = (await dexie.categories.toArray()).at(0)
      expect(category).toBeDefined()
      expect(category?.name).toBe('Groceries')
      expect(category?.type).toBe('expense')
      expect(category?.id).toBeDefined()
    })
  })

  describe('when category name already exists', () => {
    beforeEach(async () => {
      await service.create({
        name: 'Existing Category',
        type: 'income',
      })
    })

    it("fails with result.errors.nested.name contains 'Already exists'", async () => {
      const data: CategoryService.CreateData = {
        name: 'Existing Category',
        type: 'expense',
      }
      const result = await service.create(data)

      expect(result.success).toBe(false)
      expect(result.errors?.nested?.name).toContain('Already exists')

      const categoryCount = await dexie.categories.count()
      expect(categoryCount).toBe(1)
    })
  })

  describe('when name is empty', () => {
    it("fails with result.errors.nested.name contains 'Required'", async () => {
      const data: CategoryService.CreateData = {
        name: '',
        type: 'income',
      }
      const result = await service.create(data)

      expect(result.success).toBe(false)
      expect(result.errors?.nested?.name).toContain('Required')

      const categoryCount = await dexie.categories.count()
      expect(categoryCount).toBe(0)
    })
  })

  describe('when type is invalid', () => {
    it("fails with result.errors.nested.type contains 'Invalid type'", async () => {
      const data = {
        name: 'Valid Name',
        type: 'INVALID',
      } as any

      const result = await service.create(data)

      expect(result.success).toBe(false)
      expect(result.errors?.nested?.type).toContain('Invalid type')

      const categoryCount = await dexie.categories.count()
      expect(categoryCount).toBe(0)
    })
  })
})
