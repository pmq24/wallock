import CURRENCIES from './consts/CURRENCIES'

class Wallet {
  static CURRENCIES = CURRENCIES
  static CURRENCY_CODES = CURRENCIES.map((c) => c.code)

  constructor (
    public readonly id: string,
    public readonly name: string,
    public readonly currencyCode: Wallet.CurrencyCode
  ) {}

  get currency (): Wallet.Currency {
    return (this.cachedCurrency ??= CURRENCIES.find(
      (currency) => currency.code === this.currencyCode
    ))!
  }

  get currencyDivisor () {
    return 10 ** this.currency.decimalDigits
  }

  private cachedCurrency: Wallet.Currency | undefined = undefined
}

namespace Wallet {
  export type Currency = (typeof CURRENCIES)[number]
  export type CurrencyCode = Currency['code']
}

export default Wallet
