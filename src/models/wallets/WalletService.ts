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

  async all () {
    return (await this.dexie.wallets.orderBy('name').toArray()).map(
      (walletRecord) =>
        new Wallet(
          walletRecord.id,
          walletRecord.name,
          walletRecord.currencyCode
        )
    )
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
    })

    return createStandardSuccess(id)
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
