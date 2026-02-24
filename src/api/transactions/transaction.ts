import * as Categories from "@/api/categories"
import * as Wallets from "@/api/wallets"

export type TransactionOpts = {
  id: number
  amount: number
  time: number

  categoryid: number
  category: categories.category

  walletid: number
  wallet: wallets.wallet
}

export default class Transaction {
  constructor(opts: TransactionOpts) {
    this.id = opts.id
    this.amount = opts.amount
    this.time = opts.time

    this.categoryId = opts.categoryId
    this.category = opts.category

    this.walletId = opts.walletId
    this.wallet = opts.wallet
  }

  readonly id: number
  readonly amount: number
  readonly time: number

  readonly categoryId: number
  readonly category: Categories.Category

  readonly walletId: number
  readonly wallet: Wallets.Wallet
}
