import { createAppDexie } from 'models/dexie'
import SyncApp from '../SyncApp'
import CategorySyncer from '../syncers/CategorySyncer'

const syncApp = new SyncApp()
const categorySyncer = new CategorySyncer({ syncApp, categoryTable: createAppDexie().categories })

self.onmessage = async function (e) {
  const action = e.data?.action

  if (action === 'sync') {
    await categorySyncer.sync()
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

self.addEventListener('unhandledrejection', (e) => { throw e.reason })
