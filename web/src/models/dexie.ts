import Dexie, { type DexieOptions } from 'dexie'
export function createAppDexie (opts?: DexieOptions) {
  const d = new Dexie('Wallock Database', opts) as AppDexie

  d.version(1).stores({
    transactions: 'id, time, categoryId, walletId',
    categories: 'id, &[name+parentId]',
    wallets: 'id, &name',
  })

  d.on('populate', async (transaction) => {
    await transaction.table('categories').bulkAdd([
      { id: 'income', name: 'Income', parentId: '' },
      { id: 'expense', name: 'Expense', parentId: '' },
    ])
  })

  return d
}

export type AppDexie = Dexie & {
  transactions: TransactionTable;
  categories: CategoryTable;
  wallets: WalletTable;
}

export type Wallet = {
	id: string;
	name: string;
	currencyCode: string;
}
export type WalletTable = Dexie.Table<Wallet, string>

export type Category = {
	id: string;
	name: string;
	parentId: string;
}
export type CategoryTable = Dexie.Table<Category, string>

export type Transaction = {
  id: string;

  amount: number;
  time: string;

  categoryId: string;
  walletId: string;
}
export type TransactionTable = Dexie.Table<Transaction, string>
