import type Category from 'models/data/categories/Category'
import type Wallet from 'models/data/wallets/Wallet'

export default class Transaction {
  constructor (params: {
    id: string;
    amount: number;
    time: string;
    category: Category;
    wallet: Wallet;
    hash: string
  }) {
    this.id = params.id
    this.amount = params.amount
    this.time = params.time
    this.category = params.category
    this.wallet = params.wallet
    this.hash = params.hash
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
  public readonly hash: string
}
