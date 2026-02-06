import * as Currencies from './currencies'

export default class Wallet {
  constructor (opts: WalletCreationOpts) {
    this.id = opts.id
    this.name = opts.name

		const currency = Currencies.fromCode(opts.currencyCode)
		if (!currency) {
			throw new Error(`Unsupported currency code: ${opts.currencyCode}`)
		}
		this.currency = currency
  }

  readonly id: string
  readonly name: string
  readonly currency: Currencies.Currency
}

type WalletCreationOpts = {
	id: string;
	name: string;
	currencyCode: Currencies.Code;
}

