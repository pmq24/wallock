import CURRENCIES from './consts/CURRENCIES'

class Wallet {
  static CURRENCIES = CURRENCIES
  static CURRENCY_CODES = CURRENCIES.map((c) => c.code)
}

namespace Wallet {
  export type Currency = (typeof CURRENCIES)[number]
  export type CurrencyCode = Currency['code']
}

export default Wallet
