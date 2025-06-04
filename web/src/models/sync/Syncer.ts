import type AuthService from './AuthService'
import type CategorySyncer from './syncers/CategorySyncer'
import type WalletSyncer from './syncers/WalletSyncer'

export default class Syncer {
  constructor (params: {
    authService: AuthService,
    categorySyncer: CategorySyncer,
    walletSyncer: WalletSyncer
  }) {
    this.categorySyncer = params.categorySyncer

    this.walletsSyncer = params.walletSyncer
  }

  async syncCategories () {
    await this.categorySyncer.sync()
  }

  async syncWallets () {
    await this.walletsSyncer.sync()
  }

  private readonly categorySyncer: CategorySyncer

  private readonly walletsSyncer: WalletSyncer
}
