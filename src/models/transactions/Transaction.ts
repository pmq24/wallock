import type Category from 'models/categories/Category'
import type Wallet from 'models/wallets/Wallet'

export default class Transaction {
  constructor (params: {
    id: string;
    amount: number;
    time: string;
    category: Category;
    wallet: Wallet;
  }) {
    this.id = params.id
    this.time = params.time
    this.amount = params.amount
    this.category = params.category
    this.wallet = params.wallet
  }

  get displayAmount () {
    const unsignedDisplayAmount =
      (this.amount / this.wallet.currencyDivisor).toFixed(
        this.wallet.currency.decimalDigits
      ) +
      ' ' +
      this.wallet.currencyCode

    return this.category.isExpense
      ? '-' + unsignedDisplayAmount
      : unsignedDisplayAmount
  }

  public readonly id: string
  public readonly amount: number
  public readonly time: string
  public readonly category: Category
  public readonly wallet: Wallet
}
