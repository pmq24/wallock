import dayjs from 'dayjs'
import type Category from 'models/categories/Category'
import type CategoryService from 'models/categories/CategoryService'
import { createStandardSuccess } from 'models/common'
import type { TransactionTable } from 'models/dexie'
import type Wallet from 'models/wallets/Wallet'
import type WalletService from 'models/wallets/WalletService'
import { nanoid } from 'nanoid'

export default class TransactionCreationForm {
  static async prepare (params: {
    transactionTable: TransactionTable;
    categoryService: CategoryService;
    walletService: WalletService;
  }) {
    const availableCategories = await params.categoryService.all()
    const availableWallets = await params.walletService.all()
    const form = new TransactionCreationForm({
      transactionTable: params.transactionTable,
      availableCategories,
      availableWallets,
    })
    return form
  }

  private constructor (params: {
    availableCategories: Category[];
    availableWallets: Wallet[];
    transactionTable: TransactionTable;
  }) {
    this.transactionTable = params.transactionTable
    this.availableCategories = params.availableCategories
    this.availableWallets = params.availableWallets

    this._categoryId = this.availableCategories.at(0)!.id
    this._walletId = this.availableWallets.at(0)!.id
  }

  set amount (value: number) {
    const parsed = parseInt(value.toString().replace('.', ''))

    if (isNaN(parsed)) {
      this._amount = 0
      return
    }

    this._amount = parsed
  }

  get amount () {
    return this._amount
  }

  get netAmount () {
    const netAmount = this.amount / (this.wallet.currencyDivisor ?? 1)
    const formatted = netAmount.toFixed(this.wallet.currency.decimalDigits)

    if (this.category.type === 'expense') {
      return '-' + formatted
    } else {
      return formatted
    }
  }

  set timestamp (isoDate: string) {
    const parsed = dayjs(isoDate)

    if (!parsed.isValid()) {
      this._timestamp = dayjs().unix()
    }

    this._timestamp = parsed.unix()
  }

  get timestamp () {
    return dayjs.unix(this._timestamp).format('YYYY-MM-DDTHH:mm:ss')
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
      amount: this.amount,
      categoryId: this.categoryId,
      timestamp: this._timestamp,
      walletId: this.walletId,
    }

    const id = await this.transactionTable.add({ id: nanoid(), ...data })
    this._submitting = false
    return createStandardSuccess(id)
  }

  readonly availableCategories: Category[]
  readonly availableWallets: Wallet[]

  private readonly transactionTable: TransactionTable

  private _amount = 0
  private _timestamp: number = dayjs().unix()
  private _categoryId: string = ''
  private _walletId: string = ''

  private _submitting = false
}
