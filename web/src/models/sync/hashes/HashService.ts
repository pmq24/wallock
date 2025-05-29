import type Hasher from './Hasher'
import type { HashTable } from './dexie'
import type CategoryService from 'models/data/categories/CategoryService'
import type WalletService from 'models/data/wallets/WalletService'

export default class HashService {
  constructor (params: {
    hashTable: HashTable;
    hasher: Hasher;
    categoryService: CategoryService;
    walletService: WalletService;
  }) {
    this.hasher = params.hasher
    this.hashTable = params.hashTable

    this.categoryService = params.categoryService
    this.categoryService.addOnChangeListener(() => this.updateCategoriesHash())

    this.walletService = params.walletService
    this.walletService.addOnChangeListener(() => this.updateWalletsHash())
  }

  async getHash (name: string) {
    return await this.hashTable.get({ name }).then((record) => record?.hash)
  }

  async updateCategoriesHash () {
    const categories = await this.categoryService.all()
    const hash = this.hasher.hashDataCollection(categories)
    await this.hashTable.put({ name: 'categories', hash })
    await this.updateRootHash()
  }

  async updateWalletsHash () {
    const wallets = await this.walletService.all()
    const hash = this.hasher.hashDataCollection(wallets)
    await this.hashTable.put({ name: 'wallets', hash })
    await this.updateRootHash()
  }

  private async updateRootHash () {
    const hashes = await this.hashTable
      .toArray()
      .then((records) => records.filter((record) => record.name !== 'root'))
    const hash = this.hasher.hashDataCollection(hashes)
    await this.hashTable.put({ name: 'root', hash })
  }

  private readonly hasher: Hasher
  private readonly hashTable: HashTable
  private readonly categoryService: CategoryService
  private readonly walletService: WalletService
}
