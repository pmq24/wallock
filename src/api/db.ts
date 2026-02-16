import Dexie from 'dexie'

export class Db extends Dexie {
  constructor() {
    super('MyDatabase')
    this.version(1).stores({
      wallets: '++id, &name, currencyCode',
    })

    this.wallets = this.table('wallets')
  }

  readonly wallets: WalletTable
}

export type WalletTable = Dexie.Table<Wallet, number>

export type Wallet = {
  id: number
  name: string
  currencyCode: string
}
