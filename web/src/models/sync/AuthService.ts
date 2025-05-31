import * as v from 'valibot'
import type SyncApp from './SyncApp'

export default class AuthService {
  static REDIRECT_URI = import.meta.env.VITE_BASE_URL + '/sync/auth-callback'

  constructor (params: { syncApp: SyncApp }) {
    this.syncApp = params.syncApp
    this.addOnAccessTokenChangedListener((accessToken) => this.syncApp.setAccessToken(accessToken))
    this.syncApp.addOnUnauthorizedErrorListener(() => window.localStorage.removeItem('accessToken'))
  }

  get authUrl () {
    const syncBaseUrl: string = import.meta.env.VITE_SYNC_APP_BASE_URL
    return `${syncBaseUrl}/auth?redirect_uri=${AuthService.REDIRECT_URI}`
  }

  get isAuthenticated () {
    return !!this.accessToken
  }

  async handleAuthCallback ({ code, state }: { code: string; state: string }) {
    const endpoint =
      '/auth/callback' +
      `?code=${code}` +
      `&state=${state}` +
      `&redirect_uri=${AuthService.REDIRECT_URI}`

    const res = await this.syncApp.fetch(endpoint, {
      credentials: 'include',
    })
    const payload = this.checkAuthCallbackResponseSchema(res.payload)
    window.localStorage.setItem('accessToken', payload.accessToken)
    this.onAccessTokenChangedListeners.forEach(l => l(payload.accessToken))
  }

  addOnAccessTokenChangedListener (listener: (accessToken: string) => void) {
    if (this.accessToken) {
      listener(this.accessToken)
    }
    this.onAccessTokenChangedListeners.push(listener)
  }

  get accessToken () {
    return window.localStorage.getItem('accessToken') ?? undefined
  }

  private checkAuthCallbackResponseSchema (payload: unknown) {
    const schema = v.object({
      accessToken: v.string(),
    })

    return v.parse(schema, payload)
  }

  private readonly syncApp: SyncApp
  private readonly onAccessTokenChangedListeners: ((accessToken: string) => void)[] = []
}
