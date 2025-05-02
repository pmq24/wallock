import { beforeEach, describe, expect, it } from 'vitest'
import WalletService from '../WalletService'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { createAppDexie, type AppDexie } from 'models/dexie'

describe('WalletService', () => {
  let dexie: AppDexie
  let service: WalletService

  describe('create', () => {
    beforeEach(() => {
      dexie = createAppDexie({ indexedDB: new IDBFactory(), IDBKeyRange })
      service = new WalletService(dexie)
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

      it('returns error when trying to create wallet with existing name', async () => {
        const data: WalletService.CreateData = {
          name: 'Existing Wallet',
          currencyCode: 'EUR',
        }
        const result = await service.create(data)

        expect(result.success).toBe(false)
        expect(result.errors?.nested?.name).toContain('Already exists')

        const walletCount = await dexie.wallets.count()
        expect(walletCount).toBe(1)
      })
    })

    describe('when name is empty', () => {
      it('returns error for empty name', async () => {
        const data: WalletService.CreateData = {
          name: '',
          currencyCode: 'USD',
        }
        const result = await service.create(data)

        expect(result.success).toBe(false)
        expect(result.errors?.nested?.name).toContain('Required')

        const walletCount = await dexie.wallets.count()
        expect(walletCount).toBe(0)
      })
    })

    describe('when currency code is invalid', () => {
      it('returns error for invalid currency code', async () => {
        const data = {
          name: 'Valid Name',
          currencyCode: 'INVALID',
        } as any

        const result = await service.create(data)

        expect(result.success).toBe(false)
        expect(result.errors?.nested?.currencyCode).toContain(
          'Invalid currency code'
        )

        const walletCount = await dexie.wallets.count()
        expect(walletCount).toBe(0)
      })
    })
  })
})
