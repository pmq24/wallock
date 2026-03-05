import Dexie from 'dexie'

export class Db extends Dexie {
  constructor() {
    super('MyDatabase')
    this.version(1).stores({
      wallets: '++id, &name, currencyCode',
      categories: '++id, &name',
      transactions: '++id',
    })

    this.wallets = this.table('wallets')
    this.categories = this.table('categories')
    this.transactions = this.table('transactions')

    this.on('populate', async () => {
      await this.categories.bulkAdd([
        { id: 100, name: 'Expense', readonly: true },
        { id: 200, name: 'Income', readonly: true },
      ])

      await this.wallets.add({ id: 100, name: 'Main wallet' })
    })
  }

  readonly wallets: WalletTable
  readonly categories: CategoryTable
  readonly transactions: TransactionTable
}

export type WalletTable = Dexie.Table<Wallet, number>

export type Wallet = {
  id: number
  name: string
}

export type CategoryTable = Dexie.Table<Category, number>

export type Category = {
  id: number
  name: string
  parentId?: number
  readonly: boolean
}

export type TransactionTable = Dexie.Table<Transaction, number>

export type Transaction = {
  id: number
  walletId: number
  categoryId: number
  amount: number
  time: number
}

