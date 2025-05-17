import type Api from 'models/api'
import type Hasher from './Hasher'
import type { SyncHashTable } from './dexie'
import type CategoryService from 'models/categories/CategoryService'
import type WalletService from 'models/wallets/WalletService'

export default class SyncHashService {
  constructor (params: { api: Api }) {
    this.hasher = params.api.hasher
    this.syncHashTable = params.api.dexie.syncHashes

    this.categoryService = params.api.categories
    this.categoryService.addOnCreateListener(() => this.updateCategoriesHash())

    this.walletService = params.api.wallets
    this.walletService.addOnChangeListener(() => this.updateWalletsHash())
  }

  async updateCategoriesHash () {
    const categories = await this.categoryService.all()
    const hash = await this.hasher.hashDataCollection(categories)
    await this.syncHashTable.put({ name: 'categories', hash })
    await this.updateRootHash()
  }

  async updateWalletsHash () {
    const wallets = await this.walletService.all()
    const hash = await this.hasher.hashDataCollection(wallets)
    await this.syncHashTable.put({ name: 'wallets', hash })
    await this.updateRootHash()
  }

  private async updateRootHash () {
    const hashes = await this.syncHashTable
      .toArray()
      .then((records) => records.filter((record) => record.name !== 'root'))
    const hash = await this.hasher.hashDataCollection(hashes)
    await this.syncHashTable.put({ name: 'root', hash })
  }

  private readonly hasher: Hasher
  private readonly syncHashTable: SyncHashTable
  private readonly categoryService: CategoryService
  private readonly walletService: WalletService
}
