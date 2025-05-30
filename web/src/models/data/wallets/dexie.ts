import type { EntityTable } from 'dexie'
import type Wallet from './Wallet'

export const WALLET_TABLE_INDICES = 'id, &name, &hash'

export type WalletTable = EntityTable<WalletRecord, 'id'>

export type WalletRecord = {
  id: string;
  name: string;
  currencyCode: Wallet.CurrencyCode;
  isDefault: boolean;
  hash: string;
}
