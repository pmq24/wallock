import CategoryService from 'models/data/categories/CategoryService'
import WalletService from 'models/data/wallets/WalletService'
import TransactionCreationForm from './TransactionCreationForm'
import TransactionQuery from './TransactionQuery'
import _ from 'lodash'
import dayjs from 'dayjs'
import type { TransactionTable } from './dexie'
import Transaction from './Transaction'
import { NotFoundError } from '../errors'

export default class TransactionService {
  constructor (params: {
    transactionTable: TransactionTable;
    categoryService: CategoryService;
    walletService: WalletService;
  }) {
    this.transactionTable = params.transactionTable
    this.categoryService = params.categoryService
    this.walletService = params.walletService
  }

  /**
   * All the months that has transactions, plus the current month and 2 before
   */
  async visibleMonths () {
    const transactionTimes = (await this.transactionTable
      .orderBy('time')
      .uniqueKeys()) as string[]

    const today = dayjs()
    const mostRecentMonths = [
      today.format('YYYY-MM'),
      today.subtract(1, 'month').format('YYYY-MM'),
      today.subtract(2, 'month').format('YYYY-MM'),
    ]

    return _(transactionTimes)
      .map((time) => time.slice(0, 7))
      .concat(mostRecentMonths)
      .sort()
      .sortedUniq()
      .value()
  }

  async findById (id: string) {
    const record = await this.transactionTable.get(id)

    if (!record) return undefined

    const category = await this.categoryService.getById(record.categoryId)
    if (!category) throw new NotFoundError('Category', record.categoryId)
    const wallet = await this.walletService.id(record.walletId)
    if (!wallet) throw new NotFoundError('Wallet', record.walletId)

    return new Transaction({
      ...record,
      category,
      wallet,
    })
  }

  createQueryObject () {
    return new TransactionQuery({
      transactionTable: this.transactionTable,
      categoryService: this.categoryService,
      walletService: this.walletService,
    })
  }

  async createCreateForm () {
    return TransactionCreationForm.create({
      transactionTable: this.transactionTable,
      categoryService: this.categoryService,
      walletService: this.walletService,
      onSuccess: (changedTransactionId: string) => this.onChangedListener.forEach((listener) => listener(changedTransactionId)),
    })
  }

  addOnChangeListener (onChanged: (changedTransactionId: string) => void) {
    this.onChangedListener.push(onChanged)
  }

  private readonly transactionTable: TransactionTable

  private readonly categoryService: CategoryService
  private readonly walletService: WalletService

  private readonly onChangedListener: ((changedTransactionId: string) => void)[] = []
}
