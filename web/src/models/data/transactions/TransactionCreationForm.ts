import dayjs from 'dayjs'
import type Category from 'models/data/categories/Category'
import type CategoryService from 'models/data/categories/CategoryService'
import type { TransactionTable } from 'models/data/transactions/dexie'
import type Wallet from 'models/data/wallets/Wallet'
import type WalletService from 'models/data/wallets/WalletService'
import { nanoid } from 'nanoid'

export default class TransactionCreationForm {
  static async create (params: {
    transactionTable: TransactionTable;
    categoryService: CategoryService;
    walletService: WalletService;
  }) {
    const categories = await params.categoryService.getAll()
    const wallets = await params.walletService.all()

    const form = new TransactionCreationForm({
      transactionTable: params.transactionTable,
      categories,
      wallets,
    })
    return form
  }

  getCategories () {
    return this.categories
  }

  getWallets () {
    return this.wallets
  }

  setAmount (value: number) {
    this.amountTouched = true
    const parsed = parseInt(value.toString().replace('.', ''))

    if (isNaN(parsed) || parsed < 0) {
      this.amount = 0
      this.amountError = 'Amount must be positive'
    } else {
      this.amountError = ''
      this.amount = parsed
    }

    return this
  }

  getAmount () {
    return this.amount
  }

  getAmountError () {
    if (this.amountTouched) {
      return this.amountError
    } else {
      return ''
    }
  }

  getNetAmount () {
    const currencyDivisor = this.wallet?.currencyDivisor ?? 1
    const netAmount = this.amount / currencyDivisor
    const formatted = netAmount.toFixed(this.wallet?.currency.decimalDigits ?? 0)

    if (this.category?.type === 'expense') {
      return '-' + formatted
    } else {
      return formatted
    }
  }

  setTime (value: string) {
    const parsed = dayjs(value)

    if (!parsed.isValid()) {
      this.time = dayjs().format()
    } else {
      this.time = parsed.format()
    }

    return this
  }

  getTime () {
    return this.time
  }

  setCategoryId (value: string) {
    this.categoryTouched = true
    this.category = this.categories.find((c) => c.id === value)

    if (this.category) {
      this.categoryError = ''
    } else {
      this.categoryError = 'Category is required'
    }

    return this
  }

  getCategoryId () {
    return this.category?.id
  }

  getCategory () {
    return this.category
  }

  getCategoryError () {
    if (this.categoryTouched) {
      return this.categoryError
    } else {
      return ''
    }
  }

  setWalletId (value: string) {
    this.walletTouched = true
    this.wallet = this.wallets.find(w => w.id === value)

    if (this.wallet) {
      this.walletError = ''
    } else {
      this.walletError = 'Wallet is required'
    }

    return this
  }

  getWalletId () {
    return this.wallet?.id
  }

  getWallet () {
    return this.wallet
  }

  getWalletError () {
    if (this.walletTouched) {
      return this.walletError
    } else {
      return ''
    }
  }

  markAsTouched () {
    this.amountTouched = true
    this.categoryTouched = true
    this.walletTouched = true
  }

  isValid () {
    this.markAsTouched()
    return !this.getAmountError() && !this.getCategoryError() && !this.getWalletError()
  }

  getIsCreate () {
    return this.isCreated
  }

  async create () {
    if (this.isValid()) {
      const data = {
        id: nanoid(),
        amount: this.amount,
        categoryId: this.category!.id,
        time: this.time,
        walletId: this.wallet!.id,
      }

      await this.transactionTable.add(data)

      this.isCreated = true
    }

    return this
  }

  private constructor (params: {
    categories: Category[];
    wallets: Wallet[];
    transactionTable: TransactionTable;
  }) {
    this.transactionTable = params.transactionTable
    this.categories = params.categories
    this.wallets = params.wallets

    this.amountTouched = false
    this.categoryTouched = false
    this.walletTouched = false

    this.amount = 0
    this.wallet = this.wallets.at(0)
    this.category = this.categories.find(c => c.fullName === 'Expense')

    this.amountError = 'Amount must be positive'
    this.walletError = this.wallet ? '' : 'Wallet is required'
    this.categoryError = this.category ? '' : 'Category is required'

    this.isCreated = false
  }

  private readonly transactionTable: TransactionTable

  readonly categories: Category[]
  readonly wallets: Wallet[]

  private amount: number
  private amountTouched: boolean
  private amountError: string

  private time = dayjs().format()

  private category: Category | undefined
  private categoryTouched: boolean
  private categoryError: string

  private wallet: Wallet | undefined
  private walletTouched: boolean
  private walletError: string

  private isCreated: boolean
}
