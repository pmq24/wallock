import type { AppDexie } from 'models/dexie'
import * as v from 'valibot'
import { createStandardError, createStandardSuccess } from 'models/common'
import { nanoid } from 'nanoid'
import Wallet from './Wallet'

class WalletService {
  async getSchema () {
    const names = (await this.dexie.wallets
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

  constructor (private dexie: AppDexie) {}

  async count () {
    return await this.dexie.wallets.count()
  }

  async id (id: string) {
    return await this.dexie.wallets
      .get(id)
      .then((record) => (record ? new Wallet(record) : undefined))
  }

  async all () {
    return (await this.dexie.wallets.toArray())
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

    const id = await this.dexie.wallets.add({
      id: nanoid(),
      name: validation.output.name,
      currencyCode: validation.output.currencyCode as Wallet.CurrencyCode,
      isDefault: (await this.count()) === 0,
    })

    return createStandardSuccess(id)
  }

  async makeDefault (id: string) {
    const wallets = await this.all()

    const wallet = wallets.find((w) => w.id === id)

    if (!wallet) {
      return createStandardError('Wallet not found')
    }

    if (wallet.isDefault) {
      return createStandardError(wallet)
    }

    const currentDefaultWallet = wallets.find((w) => w.isDefault)
    if (currentDefaultWallet) {
      await this.dexie.wallets.update(currentDefaultWallet.id, {
        isDefault: false,
      })
    }
    await this.dexie.wallets.update(id, { isDefault: true })
    return createStandardSuccess(await this.id(id))
  }
}

namespace WalletService {
  export type CreateData = {
    name: string;
    currencyCode: Wallet.CurrencyCode;
  }
  export type CreateErrors = v.FlatErrors<
    Awaited<ReturnType<WalletService['getSchema']>>
  >
}

export default WalletService
