export type WalletOptions = {
  id: number
  name: string
}

export default class Wallet {
  constructor(options: WalletOptions) {
    this.id = options.id
    this.name = options.name
  }

  readonly id: number
  readonly name: string
}
