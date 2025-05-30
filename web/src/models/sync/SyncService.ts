import CategoriesSyncService from './CategoriesSyncService'
import type WalletsSyncService from './WalletsSyncService'

export default class SyncService {
  constructor (params: {
    categorySyncService: CategoriesSyncService
    walletsSyncService: WalletsSyncService
  }) {
    this.categorySyncService = params.categorySyncService
    this.walletsSyncService = params.walletsSyncService
  }

  async sync () {
    this.categorySyncService.sync()
    this.walletsSyncService.sync()
  }

  private readonly categorySyncService: CategoriesSyncService
  private readonly walletsSyncService: WalletsSyncService
}
