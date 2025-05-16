import { beforeEach, describe, expect, it } from 'vitest'
import WalletService from '../../WalletService'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { createAppDexie, type AppDexie } from 'models/dexie'

describe('WalletService - makeDefault', () => {
  let dexie: AppDexie
  let service: WalletService

  let firstWalletId: string = ''
  let secondWalletId: string = ''

  beforeEach(async () => {
    dexie = createAppDexie({ indexedDB: new IDBFactory(), IDBKeyRange })
    service = new WalletService(dexie)

    let mockResult
    mockResult = await service.create({
      name: 'First Wallet',
      currencyCode: 'USD',
    })
    if (mockResult.success) {
      firstWalletId = mockResult.data
    } else {
      throw new Error('First wallet creation failed')
    }

    mockResult = await service.create({
      name: 'Second Wallet',
      currencyCode: 'EUR',
    })
    if (mockResult.success) {
      secondWalletId = mockResult.data
    } else {
      throw new Error('Second wallet creation failed')
    }

    const firstWallet = await service.id(firstWalletId)
    const secondWallet = await service.id(secondWalletId)
    if (!firstWallet!.isDefault || secondWallet!.isDefault) {
      throw new Error('Default wallet not created correctly')
    }
  })

  describe('when wallet exists and is not default', () => {
    it('makes the wallet default and removes default status from previous default wallet', async () => {
      const result = await service.makeDefault(secondWalletId)

      expect(result.success).toBe(true)
      expect(result.data?.id).toBe(secondWalletId)
      expect(result.data?.isDefault).toBe(true)

      const firstWallet = await service.id(firstWalletId)
      const secondWallet = await service.id(secondWalletId)
      expect(firstWallet!.isDefault).toBe(false)
      expect(secondWallet!.isDefault).toBe(true)
    })
  })

  describe('when wallet is already default', () => {
    const errorMessage = 'Wallet is already default'
    it(`fails with error message '${errorMessage}'`, async () => {
      const result = await service.makeDefault(firstWalletId)
      expect(result.success).toBe(false)
      expect(result.errors).toEqual(errorMessage)
    })
  })

  describe('when wallet does not exist', () => {
    const errorMessage = 'Wallet not found'
    it(`fails with error message '${errorMessage}'`, async () => {
      const nonExistentId = 'non-existent-id'
      const result = await service.makeDefault(nonExistentId)

      expect(result.success).toBe(false)
      expect(result.errors).toBe(errorMessage)
    })
  })
})
