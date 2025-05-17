import { beforeEach, describe, expect, it } from 'vitest'
import TransactionCreationForm from '../TransactionCreationForm'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { type AppDexie } from 'models/dexie'
import CategoryService from 'models/categories/CategoryService'
import WalletService from 'models/wallets/WalletService'
import { mockCategories } from 'models/categories/test/common'
import { mockWallets } from 'models/wallets/test/common'
import dayjs from 'dayjs'
import setUpEnv from 'setUpEnv'
import Api from 'models/api'

setUpEnv()

describe('TransactionCreationForm', () => {
  let dexie: AppDexie
  let form: TransactionCreationForm

  beforeEach(async () => {
    const api = new Api({
      dexieOpts: { indexedDB: new IDBFactory(), IDBKeyRange },
    })
    dexie = api.dexie

    const categoryService = new CategoryService({ api })
    await mockCategories(categoryService)

    const walletService = new WalletService({ api })
    await mockWallets(walletService)

    form = await TransactionCreationForm.create({
      transactionTable: dexie.transactions,
      categoryService,
      walletService,
    })
  })

  describe('setting amount', () => {
    describe('when setting it to an integer', async () => {
      it('saves it as-is', () => {
        form.amount = 12345
        expect(form.amount).toBe(12345)
      })
    })

    describe('when setting it to a float', async () => {
      it('parses it as an integer without decimal point', () => {
        form.amount = 123.45
        expect(form.amount).toBe(12345)
      })
    })

    describe('when setting it to a negative number', async () => {
      it('sets it to 0', () => {
        form.amount = -100
        expect(form.amount).toBe(0)
      })
    })

    describe('when setting it to 0', async () => {
      it('saves it as 0', () => {
        form.amount = 0
        expect(form.amount).toBe(0)
      })
    })

    describe('when setting it to a string', async () => {
      it('parses valid number strings', () => {
        // @ts-expect-error Testing invalid type
        form.amount = '123'
        expect(form.amount).toBe(123)
      })

      it('sets to 0 for invalid strings', () => {
        // @ts-expect-error Testing invalid type
        form.amount = 'not-a-number'
        expect(form.amount).toBe(0)
      })
    })
  })

  describe('setting time', () => {
    describe('when setting it to a valid date string', () => {
      it('saves it as-is', () => {
        const time = '2023-05-15T10:30:00'
        form.time = time
        expect(form.time).toEqual(time)
      })
    })

    describe('when setting it to a invalid date string', async () => {
      it('sets it to the current time', () => {
        form.time = 'not-a-date'

        const formTime = dayjs(form.time)
        expect(formTime.isValid()).toBe(true)
      })
    })
  })

  describe('setting categoryId', () => {
    describe('when setting it to a valid id', async () => {
      it('saves it as-is', () => {
        const category = form.availableCategories[1]
        form.categoryId = category.id
        expect(form.categoryId).toBe(category.id)
      })
    })

    describe('when setting it to a non-existent id', async () => {
      it('sets it to the first available category', () => {
        const firstCategory = form.availableCategories[0]
        form.categoryId = 'non-existent-id'
        expect(form.categoryId).toBe(firstCategory.id)
      })
    })
  })

  describe('setting walletId', () => {
    describe('when setting it to a valid id', async () => {
      it('saves it as-is', () => {
        const wallet = form.availableWallets[1]
        form.walletId = wallet.id
        expect(form.walletId).toBe(wallet.id)
      })
    })

    describe('when setting it to a non-existent id', async () => {
      it('sets it to the first available wallet', () => {
        const firstWallet = form.availableWallets[0]
        form.walletId = 'non-existent-id'
        expect(form.walletId).toBe(firstWallet.id)
      })
    })
  })

  describe('submitting', () => {
    it('creates a transaction with correct data', async () => {
      form.amount = 15075
      const category = form.availableCategories[1]
      form.categoryId = category.id
      const wallet = form.availableWallets[1]
      form.walletId = wallet.id
      const time = '2023-05-15T10:30:00'
      form.time = time
      const result = await form.submit()

      expect(result.success).toBe(true)
    })
  })
})
