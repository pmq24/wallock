import type TransactionService from 'models/data/transactions/TransactionService'
import type { TransactionHashTable } from './dexie'
import { NotFoundError } from 'models/data/errors'
import type Hasher from 'models/sync/hashes/Hasher'

export default class TransactionHashService {
  constructor (params: { transactionHashTable: TransactionHashTable, transactionService: TransactionService, hasher: Hasher }) {
    this.transactionService = params.transactionService
    this.transactionService.addOnChangeListener((changedTransactionId: string) => this.updateTransactionHash(changedTransactionId))
    this.transactionHashTable = params.transactionHashTable
    this.hasher = params.hasher
  }

  async updateTransactionHash (changedTransactionId: string) {
    const transaction = await this.transactionService.findById(changedTransactionId)

    if (!transaction) throw new NotFoundError('Transaction', changedTransactionId)

    const month = transaction.time.slice(0, 7)

    const transactionQuery = this.transactionService.createQueryObject()
    transactionQuery.filterByPeriod(month)
    const transactionsInMonth = await transactionQuery.execute()

    const hash = this.hasher.hashDataCollection(transactionsInMonth)
    await this.transactionHashTable.put({ period: month, hash })

    const year = transaction.time.slice(0, 4)
    const months = await this.transactionHashTable.where('period').startsWith(year + '-').toArray()
    const yearHash = this.hasher.hashDataCollection(months)
    await this.transactionHashTable.put({ period: year, hash: yearHash })

    const years = await this.transactionHashTable.where('period').between('0000', '9999').toArray()
    const rootHash = this.hasher.hashDataCollection(years)
    await this.transactionHashTable.put({ period: '', hash: rootHash })
  }

  private readonly transactionHashTable: TransactionHashTable
  private readonly transactionService: TransactionService
  private readonly hasher: Hasher
}
