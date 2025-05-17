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

  get netAmount () {
    return this.category.isExpense ? -this.amount : this.amount
  }

  get netAmountFloat () {
    return this.netAmount / this.wallet.currencyDivisor
  }

  public readonly id: string
  public readonly amount: number
  public readonly time: string
  public readonly category: Category
  public readonly wallet: Wallet
}
