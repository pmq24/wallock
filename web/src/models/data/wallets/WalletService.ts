import * as v from 'valibot'
import { createStandardError, createStandardSuccess } from 'models/common'
import { nanoid } from 'nanoid'
import Wallet from './Wallet'
import type { WalletTable } from './dexie'

class WalletService {
  constructor (params: { walletTable: WalletTable }) {
    this.walletTable = params.walletTable
  }

  async count () {
    return await this.walletTable.count()
  }

  async id (id: string) {
    return await this.walletTable
      .get(id)
      .then((record) => (record ? new Wallet(record) : undefined))
  }

  async all () {
    return (await this.walletTable.toArray())
      .sort((w1, w2) => {
        if (w1.isDefault) return -1
        if (w2.isDefault) return 1
        if (w1.name < w2.name) return -1
        return 1
      })
      .map((walletRecord) => new Wallet(walletRecord))
  }

  async create (data: WalletService.CreateData) {
    const validation = v.safeParse(await this.getSchema(), data)

    if (!validation.success) {
      const errors = v.flatten(validation.issues)
      return createStandardError(errors)
    }

    const record = {
      id: nanoid(),
      name: validation.output.name,
      currencyCode: validation.output.currencyCode as Wallet.CurrencyCode,
      isDefault: (await this.count()) === 0,
    }
    const id = await this.walletTable.add(record)

    this.onChangeListeners.forEach((listener) => listener())

    return createStandardSuccess(id)
  }

  addOnChangeListener (listener: WalletService.OnChangeListener) {
    this.onChangeListeners.push(listener)
  }

  async makeDefault (id: string) {
    const wallets = await this.all()

    const wallet = wallets.find((w) => w.id === id)

    if (!wallet) {
      return createStandardError('Wallet not found' as const)
    }

    if (wallet.isDefault) {
      return createStandardError('Wallet is already default' as const)
    }

    const currentDefaultWallet = wallets.find((w) => w.isDefault)
    if (currentDefaultWallet) {
      await this.walletTable.update(currentDefaultWallet.id, {
        isDefault: false,
      })
    }
    await this.walletTable.update(id, { isDefault: true })
    this.onChangeListeners.forEach((listener) => listener())
    return createStandardSuccess(await this.id(id))
  }

  async getSchema () {
    const names = (await this.walletTable
      .orderBy('name')
      .uniqueKeys()) as string[]

    return v.object({
      name: v.pipe(
        v.string(),
        v.minLength(1, 'Required'),
        v.notValues(names, 'Already exists')
      ),
      currencyCode: v.pipe(
        v.string(),
        v.values(Wallet.CURRENCY_CODES, 'Invalid currency code')
      ),
    })
  }

  private readonly walletTable: WalletTable

  private onChangeListeners: WalletService.OnChangeListener[] = []
}

namespace WalletService {
  export type CreateData = {
    name: string;
    currencyCode: Wallet.CurrencyCode;
  }
  export type CreateErrors = v.FlatErrors<
    Awaited<ReturnType<WalletService['getSchema']>>
  >
  export type OnChangeListener = () => void
}

export default WalletService
