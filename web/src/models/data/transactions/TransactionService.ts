import CategoryService from 'models/data/categories/CategoryService'
import WalletService from 'models/data/wallets/WalletService'
import TransactionCreationForm from './TransactionCreationForm'
import TransactionQuery from './TransactionQuery'
import type { TransactionTable } from './dexie'
import Transaction from './Transaction'
import { NotFoundError } from '../errors'
import TransactionCreator from './TransactionCreator'

export default class TransactionService {
  constructor (params: {
    transactionTable: TransactionTable;
    categoryService: CategoryService;
    walletService: WalletService;
  }) {
    this.transactionTable = params.transactionTable
    this.categoryService = params.categoryService
    this.walletService = params.walletService

    this.query = new TransactionQuery({
      transactionTable: this.transactionTable,
      categoryService: this.categoryService,
      walletService: this.walletService
    })

    this.creator = new TransactionCreator({
      categoryService: this.categoryService,
      walletService: this.walletService
    })
  }

  readonly creator: TransactionCreator
  readonly query: TransactionQuery

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

  async createCreateForm () {
    return TransactionCreationForm.create({
      transactionTable: this.transactionTable,
      categoryService: this.categoryService,
      walletService: this.walletService,
    })
  }

  private readonly transactionTable: TransactionTable

  private readonly categoryService: CategoryService
  private readonly walletService: WalletService
}
