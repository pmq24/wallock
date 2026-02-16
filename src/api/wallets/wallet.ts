import * as Currencies from './currencies'

export type WalletOptions = {
  id: number
  name: string
  currencyCode: string
}

export default class Wallet {
  constructor(options: WalletOptions) {
    this.id = options.id
    this.name = options.name
    const currency = Currencies.fromCode(options.currencyCode)

    if (!currency) {
      throw new Error(`Unsupported currency code: ${options.currencyCode}`)
    }
    this.currency = currency
  }

  readonly id: number
  readonly name: string
  readonly currency: Currencies.Currency
}
