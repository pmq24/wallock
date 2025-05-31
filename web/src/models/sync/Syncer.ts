import type AuthService from './AuthService'
import type CategorySyncer from './syncers/CategorySyncer'
import type WalletSyncer from './syncers/WalletSyncer'
import CategoriesSyncWorker from './workers/CategoriesSyncWorker?worker'
import WalletsSyncWorker from './workers/WalletsSyncWorker?worker'

export default class Syncer {
  constructor (params: {
    authService: AuthService,
    categorySyncer: CategorySyncer,
    walletSyncer: WalletSyncer
  }) {
    this.categorySyncer = params.categorySyncer
    this.categoriesSyncWorker = new CategoriesSyncWorker()

    params.authService.addOnAccessTokenChangedListener((accessToken) => {
      this.categoriesSyncWorker.postMessage({ action: 'setAccessToken', accessToken })
    })
    this.categoriesSyncWorker.onmessage = (e) => {
      if (e.data?.status === 'success') {
        console.log('success')
      }
    }
    this.categoriesSyncWorker.onerror = (e) => {
      console.log(e)
    }

    this.walletsSyncer = params.walletSyncer
    this.walletsSyncWorker = new WalletsSyncWorker()
    params.authService.addOnAccessTokenChangedListener((accessToken) => {
      this.walletsSyncWorker.postMessage({ action: 'setAccessToken', accessToken })
    })
    this.walletsSyncWorker.onerror = function (e) {
      console.log(e.error)
    }

    const accessToken = params.authService.accessToken
    if (accessToken) {
      this.categoriesSyncWorker.postMessage({ action: 'setAccessToken', accessToken })
      this.walletsSyncWorker.postMessage({ action: 'setAccessToken', accessToken })
    }
  }

  async syncCategories () {
    await this.categorySyncer.sync()
  }

  async syncWallets () {
    await this.walletsSyncer.sync()
  }

  private readonly categoriesSyncWorker: Worker
  private readonly categorySyncer: CategorySyncer

  private readonly walletsSyncWorker: Worker
  private readonly walletsSyncer: WalletSyncer
}
