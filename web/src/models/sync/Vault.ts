import type { VaultRecord } from './dexie'

export default class Vault {
  constructor (params: VaultRecord) {
    this.id = params.id
    this.remoteId = params.remoteId
  }

  public readonly id: string
  public readonly remoteId: string
}
