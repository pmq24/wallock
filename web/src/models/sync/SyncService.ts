import type CategoryService from 'models/data/categories/CategoryService'
import type AuthService from './AuthService'
import type HashService from './hashes/HashService'

export default class SyncService {
  constructor (params: {
    authService: AuthService;
    hashService: HashService;
    categoryService: CategoryService;
  }) {
    this.authService = params.authService
    this.hashService = params.hashService
    this.categoryService = params.categoryService
  }

  async syncCategories () {
    const needSync = await this.categoriesNeedSync()

    if (!needSync) {
      return
    }
    const localHashes = await this.categoryService
      .all()
      .then((categories) => categories.map((c) => c.hash))
    const categoriesToPull = await this.authService
      .fetchSyncApp(
        `/categories_sync/pull_to_local?hashes=${localHashes.join(' ')}`
      )
      .then(async (res) => res.json())
    console.log(categoriesToPull)

    const differentFromRemote = await this.authService
      .fetchSyncApp(
        `/categories_sync/different_from_remote?hashes=${localHashes.join(' ')}`
      )
      .then(async (res) => res.json())
    console.log(differentFromRemote)

    const categoriesToPush =
      await this.categoryService.byHashes(differentFromRemote)

    const res = await this.authService.fetchSyncApp(
      '/categories_sync/push_to_remote',
      {
        method: 'POST',
        body: JSON.stringify({ categories: categoriesToPush }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    console.log(res.status)
  }

  private async categoriesNeedSync () {
    const remoteHash = await this.authService
      .fetchSyncApp('/categories_sync/hash')
      .then(async (res) => await res.text())
    const localHash = await this.hashService.getHash('categories')

    return remoteHash !== localHash
  }

  private readonly hashService: HashService
  private readonly authService: AuthService
  private readonly categoryService: CategoryService
}
