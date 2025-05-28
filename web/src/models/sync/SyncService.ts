import type CategoryService from 'models/data/categories/CategoryService'
import type AuthService from './AuthService'

export default class SyncService {
  constructor (params: {
    authService: AuthService;
    categoryService: CategoryService;
  }) {
    this.authService = params.authService
    this.categoryService = params.categoryService
  }

  async syncCategories () {
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

  private readonly authService: AuthService
  private readonly categoryService: CategoryService
}
