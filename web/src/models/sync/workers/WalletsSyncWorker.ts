import { createAppDexie } from 'models/dexie'
import SyncApp from '../SyncApp'
import WalletSyncer from '../syncers/WalletSyncer'

const syncApp = new SyncApp()
const walletSyncer = new WalletSyncer({ syncApp, walletTable: createAppDexie().wallets })

self.onmessage = function (e) {
  const action = e.data?.action

  if (action === 'sync') {
    walletSyncer.sync()
    self.postMessage({ status: 'success' })
  } else if (action === 'setAccessToken') {
    const accessToken = e.data?.accessToken

    if (!accessToken) {
      throw new Error('Access token is empty')
    }

    syncApp.setAccessToken(e.data.accessToken)
  } else {
    throw new Error('Unknown action: ' + action)
  }
}
