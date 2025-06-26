import CURRENCIES from './consts/CURRENCIES'
import type { WalletRecord } from './dexie'

class Wallet {
  static CURRENCIES = CURRENCIES
  static CURRENCY_CODES = CURRENCIES.map((c) => c.code)

  constructor (params: WalletRecord) {
    this.id = params.id
    this.name = params.name
    this.currencyCode = params.currencyCode
    this.isDefault = params.isDefault
  }

  get currency (): Wallet.Currency {
    return (this.cachedCurrency ??= CURRENCIES.find(
      (currency) => currency.code === this.currencyCode
    ))!
  }

  get currencyDivisor () {
    return 10 ** this.currency.decimalDigits
  }

  public readonly id: string
  public readonly name: string
  public readonly currencyCode: Wallet.CurrencyCode
  public readonly isDefault: boolean

  private cachedCurrency: Wallet.Currency | undefined = undefined
}

namespace Wallet {
  export type Currency = (typeof CURRENCIES)[number]
  export type CurrencyCode = Currency['code']
}

export default Wallet
