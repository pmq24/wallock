import { beforeEach, describe, expect, it } from 'vitest'
import WalletService from '../../WalletService'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import Api from 'models/api'

describe('WalletService - count', () => {
  let service: WalletService

  beforeEach(async () => {
    const api = new Api({
      dexieOpts: { indexedDB: new IDBFactory(), IDBKeyRange },
    })
    service = new WalletService({
      walletTable: api.dexie.wallets,
      hasher: api.hasher,
    })
  })

  describe('when there is no wallet', async () => {
    it('returns 0', async () => {
      const count = await service.count()
      expect(count).toBe(0)
    })
  })

  describe('when wallets exist', async () => {
    it('returns the correct count', async () => {
      const mockWallets: WalletService.CreateData[] = [
        { name: 'Wallet 1', currencyCode: 'USD' },
        { name: 'Wallet 2', currencyCode: 'EUR' },
      ]
      for (const data of mockWallets) {
        const mockResult = await service.create(data)

        if (!mockResult.success) {
          throw Error(`Failed to mock wallet: ${mockResult.errors}`)
        }
      }

      const count = await service.count()
      expect(count).toBe(2)
    })
  })
})
