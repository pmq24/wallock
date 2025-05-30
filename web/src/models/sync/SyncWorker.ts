import type CategoriesSyncService from './CategoriesSyncService'

export default class SyncWorker {
  constructor (params: { categoriesSyncService: CategoriesSyncService }) {
    this.categoriesSyncService = params.categoriesSyncService
  }

  private readonly categoriesSyncService: CategoriesSyncService
}
