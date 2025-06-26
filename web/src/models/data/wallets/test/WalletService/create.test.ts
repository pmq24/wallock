import { beforeEach, describe, expect, it } from 'vitest'
import WalletService from '../../WalletService'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { type AppDexie } from 'models/dexie'
import Api from 'models/api'

describe('WalletService - create', () => {
  let dexie: AppDexie
  let service: WalletService

  beforeEach(() => {
    const api = new Api({
      dexieOpts: { indexedDB: new IDBFactory(), IDBKeyRange },
    })
    dexie = api.dexie
    service = new WalletService({
      walletTable: dexie.wallets,
    })
  })

  describe('when data is valid', () => {
    it('creates a wallet', async () => {
      const data: WalletService.CreateData = {
        name: 'My Wallet',
        currencyCode: 'USD',
      }
      const result = await service.create(data)

      expect(result.success).toBe(true)

      const walletCount = await dexie.wallets.count()
      expect(walletCount).toBe(1)

      const wallet = (await dexie.wallets.toArray()).at(0)
      expect(wallet).toBeDefined()
      expect(wallet?.name).toBe('My Wallet')
      expect(wallet?.currencyCode).toBe('USD')
      expect(wallet?.id).toBeDefined()
    })
  })

  describe('when wallet name already exists', () => {
    beforeEach(async () => {
      await service.create({
        name: 'Existing Wallet',
        currencyCode: 'USD',
      })
    })

    const errorMessage = 'Already exists'
    it(`fails with result.errors.nested.name contains '${errorMessage}'`, async () => {
      const data: WalletService.CreateData = {
        name: 'Existing Wallet',
        currencyCode: 'EUR',
      }
      const result = await service.create(data)

      expect(result.success).toBe(false)
      expect(result.errors?.nested?.name).toContain(errorMessage)

      const walletCount = await dexie.wallets.count()
      expect(walletCount).toBe(1)
    })
  })

  describe('when name is empty', () => {
    const errorMessage = 'Required'
    it(`fails with result.errors.nested.name contains '${errorMessage}'`, async () => {
      const data: WalletService.CreateData = {
        name: '',
        currencyCode: 'USD',
      }
      const result = await service.create(data)

      expect(result.success).toBe(false)
      expect(result.errors?.nested?.name).toContain(errorMessage)

      const walletCount = await dexie.wallets.count()
      expect(walletCount).toBe(0)
    })
  })

  describe('when currency code is invalid', () => {
    const errorMessage = 'Invalid currency code'
    it(`fails with result.errors.nested.currencyCode contains '${errorMessage}'`, async () => {
      const data = {
        name: 'Valid Name',
        currencyCode: 'INVALID',
      } as any

      const result = await service.create(data)

      expect(result.success).toBe(false)
      expect(result.errors?.nested?.currencyCode).toContain(errorMessage)

      const walletCount = await dexie.wallets.count()
      expect(walletCount).toBe(0)
    })
  })
})
