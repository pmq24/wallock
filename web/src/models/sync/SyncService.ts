import { createStandardError, createStandardSuccess } from 'models/common'
import * as v from 'valibot'
import VaultService from './VaultService'
import type { VaultTable } from './dexie'

class SyncService {
  static REDIRECT_URI = import.meta.env.VITE_BASE_URL + '/sync/auth-callback'

  constructor (params: { vaultTable: VaultTable }) {
    this.vaultService = new VaultService({ vaultTable: params.vaultTable })
  }

  async getVault () {
    return await this.vaultService.get()
  }

  async getRemoteVault () {
    const vault = await this.getVault()
    if (!vault) return undefined

    const res = await this.fetchSyncApp(`/vaults/${vault.remoteId}`)
    const payload: { id: string; name: string; url: string } = await res.json()
    payload.url = `https://drive.google.com/drive/folders/${payload.id}`
    return payload
  }

  async createVault (data: SyncService.CreateVaultData) {
    const alreadyExists = await this.vaultService.get()
    if (alreadyExists) {
      return createStandardError({
        root: ['Already exists' as const] as const,
      })
    }

    data.name ||= 'Wallock'

    const res = await this.fetchSyncApp('/vaults', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    let payload
    payload = await res.json()
    const schema = v.object({
      id: v.pipe(v.string(), v.minLength(1)),
    })
    const result = v.safeParse(schema, payload)
    if (!result.success) {
      throw new Error('Sync App: POST /vaults/ has changed API schema')
    }

    payload = result.output
    const id = await this.vaultService.create({
      remoteId: payload.id,
    })

    return createStandardSuccess(id)
  }

  get authUrl () {
    const syncBaseUrl: string = import.meta.env.VITE_SYNC_APP_BASE_URL
    return `${syncBaseUrl}/auth?redirect_uri=${SyncService.REDIRECT_URI}`
  }

  get isAuthenticated () {
    return !!this.accessToken
  }

  async handleAuthCallback ({ code, state }: { code: string; state: string }) {
    const endpoint =
      '/auth/callback' +
      `?code=${code}` +
      `&state=${state}` +
      `&redirect_uri=${SyncService.REDIRECT_URI}`

    const res = await this.fetchSyncApp(endpoint, {
      credentials: 'include',
    })
    const payload: unknown = await res.json()

    const schema = v.object({
      access_token: v.string(),
    })
    const validation = v.safeParse(schema, payload)
    if (!validation.success) {
      return createStandardError(v.flatten(validation.issues))
    }

    return createStandardSuccess(validation.output.access_token)
  }

  private fetchSyncApp (
    endpoint: string,
    init: RequestInit | undefined = undefined
  ) {
    return window.fetch(import.meta.env.VITE_SYNC_APP_BASE_URL + endpoint, {
      ...init,
      headers: {
        ...(this.accessToken
          ? { Authorization: `Bearer ${this.accessToken}` }
          : {}),
        ...init?.headers,
      },
    })
  }

  private get accessToken () {
    return window.localStorage.getItem('accessToken')
  }

  private readonly vaultService: VaultService
}

namespace SyncService {
  export type CreateVaultData = {
    name: string | undefined;
  }
}

export default SyncService
