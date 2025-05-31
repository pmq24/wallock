import type TransactionService from 'models/data/transactions/TransactionService'
import type { TransactionHashTable } from './dexie'
import { NotFoundError } from 'models/data/errors'
import { sortBy } from 'lodash'
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
    let transactionsInMonth = await transactionQuery.execute()
    transactionsInMonth = sortBy(transactionsInMonth, ['time', 'amount'])

    const hash = this.hasher.hashDataCollection(transactionsInMonth)

    await this.transactionHashTable.put({ period: month, hash })
  }

  private readonly transactionHashTable: TransactionHashTable
  private readonly transactionService: TransactionService
  private readonly hasher: Hasher
}
