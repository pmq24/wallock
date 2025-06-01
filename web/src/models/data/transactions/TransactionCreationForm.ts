import dayjs from 'dayjs'
import type Category from 'models/data/categories/Category'
import type CategoryService from 'models/data/categories/CategoryService'
import { createStandardSuccess } from 'models/common'
import type { TransactionTable } from 'models/data/transactions/dexie'
import type Wallet from 'models/data/wallets/Wallet'
import type WalletService from 'models/data/wallets/WalletService'
import { nanoid } from 'nanoid'
import type Hasher from 'models/sync/hashes/Hasher'

export default class TransactionCreationForm {
  static async create (params: {
    transactionTable: TransactionTable;
    categoryService: CategoryService;
    walletService: WalletService;
    hasher: Hasher,
    onSuccess: (id: string) => void
  }) {
    const availableCategories = await params.categoryService.all()
    const availableWallets = await params.walletService.all()
    const form = new TransactionCreationForm({
      hasher: params.hasher,
      transactionTable: params.transactionTable,
      availableCategories,
      availableWallets,
      onSuccess: params.onSuccess
    })
    return form
  }

  set amount (value: number) {
    const parsed = parseInt(value.toString().replace('.', ''))

    if (isNaN(parsed)) {
      this._amount = 0
      return
    }

    if (parsed < 0) {
      this._amount = 0
      return
    }

    this._amount = parsed
  }

  get amount () {
    return this._amount
  }

  get netAmount () {
    const netAmount = this.amount / this.wallet.currencyDivisor
    const formatted = netAmount.toFixed(this.wallet.currency.decimalDigits)

    if (this.category.type === 'expense') {
      return '-' + formatted
    } else {
      return formatted
    }
  }

  set time (value: string) {
    const parsed = dayjs(value)

    if (!parsed.isValid()) {
      this._time = dayjs().format()
      return
    }

    this._time = parsed.format()
  }

  get time () {
    return this._time
  }

  set categoryId (value: string) {
    const selectedCategory = this.availableCategories.find(
      (c) => c.id === value
    )

    if (!selectedCategory) {
      this._categoryId = this.availableCategories.at(0)!.id
      return
    }

    this._categoryId = selectedCategory.id
  }

  get categoryId () {
    return this._categoryId
  }

  get category () {
    return this.availableCategories.find((c) => c.id === this.categoryId)!
  }

  set walletId (value: string) {
    const selectedWallet = this.availableWallets.find((w) => w.id === value)

    if (!selectedWallet) {
      this._walletId = this.availableWallets.at(0)!.id
      return
    }

    this._walletId = selectedWallet.id
  }

  get walletId () {
    return this._walletId
  }

  get wallet () {
    return this.availableWallets.find((w) => w.id === this.walletId)!
  }

  get submitting () {
    return this._submitting
  }

  async submit () {
    this._submitting = true
    const data = {
      id: nanoid(),
      amount: this.amount,
      categoryId: this.categoryId,
      time: this._time,
      walletId: this.walletId,
    }

    const hash = this.hasher.hashData(data)

    const id = await this.transactionTable.add({ ...data, hash })
    this._submitting = false
    this.onSuccess(id)
    return createStandardSuccess(id)
  }

  private constructor (params: {
    hasher: Hasher,
    availableCategories: Category[];
    availableWallets: Wallet[];
    transactionTable: TransactionTable;
    onSuccess: (id: string) => void
  }) {
    this.hasher = params.hasher
    this.transactionTable = params.transactionTable
    this.availableCategories = params.availableCategories
    this.availableWallets = params.availableWallets

    this._categoryId = this.availableCategories.at(0)!.id
    this._walletId = this.availableWallets.at(0)!.id

    this.onSuccess = params.onSuccess
  }

  readonly availableCategories: Category[]
  readonly availableWallets: Wallet[]

  private readonly transactionTable: TransactionTable
  private readonly hasher: Hasher

  private _amount = 0
  private _time: string = dayjs().format()
  private _categoryId: string = ''
  private _walletId: string = ''

  private _submitting = false
  private readonly onSuccess: ((id: string) => void)
}
