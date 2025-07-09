import { ValidationError } from 'models/data/errors'
import type CategoryService from 'models/data/categories/CategoryService'
import type WalletService from 'models/data/wallets/WalletService'
import * as v from 'valibot'
import Category from 'models/data/categories/Category'
import dayjs from 'dayjs'

export default class TransactionCreator {
  constructor (params: {
    categoryService: CategoryService,
    walletService: WalletService
  }) {
    this.categoryService = params.categoryService
    this.walletService = params.walletService
  }

  async scanImage (imageBase64: string) {
    if (!imageBase64) {
      const e = new ValidationError<{ imageBase64: string }>()
      e.set('imageBase64', 'Required')
      throw e
    }

    const data = await this.requestScanImage(imageBase64)

    let category
    if (data.category) {
      category = (await this.categoryService.getByNameAndType(data.category, data.type as Category.Type))!
    } else {
      const categories = await this.categoryService.getByType(data.type as Category.Type)
      category = categories.at(0)!
    }

    let wallet
    if (data.wallet) {
      wallet = (await this.walletService.getByName(data.wallet))!
    } else {
      wallet = await this.walletService.getDefault()
    }

    const time = dayjs(data.time)
    return {
      amount: data.amount,
      categoryId: category.id,
      walletId: wallet.id,
      time: time.toISOString()
    } as const
  }

  private async requestScanImage (imageBase64: string) {
    let categories
    categories = await this.categoryService.getAll()
    categories = categories.map(c => c.name)

    let wallets
    wallets = await this.walletService.all()
    wallets = wallets.map(w => w.name)

    const res = await fetch('/api/transaction-scans/', {
      method: 'POST',
      body: JSON.stringify({
        imageBase64,
        categories,
        wallets
      })
    })

    if (res.status >= 400 && res.status < 500) {
      throw new Error(`Failed to scan transaction: ${res.statusText}`)
    }

    return await this.validateScanResponse(res)
  }

  private async validateScanResponse (res: Response) {
    const payload: unknown = await res.json()

    const schema = v.object({
      amount: v.pipe(v.number(), v.minValue(1)),
      type: v.pipe(v.string(), v.values(Category.TYPES)),
      category: v.optional(v.string(), ''),
      wallet: v.pipe(v.string()),
      time: v.pipe(v.string())
    })

    const validation = v.safeParse(schema, payload)
    if (!validation.success) {
      throw Error(`Transaction Scans API has changed the response shape: ${JSON.stringify(v.flatten(validation.issues), null, 2)}`)
    }

    return validation.output
  }

  private readonly categoryService: CategoryService
  private readonly walletService: WalletService
}
