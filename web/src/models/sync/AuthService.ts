import { createStandardError, createStandardSuccess } from 'models/common'
import * as v from 'valibot'

export default class AuthService {
  static REDIRECT_URI = import.meta.env.VITE_BASE_URL + '/sync/auth-callback'

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

    window.localStorage.setItem('accessToken', validation.output.access_token)
    return createStandardSuccess(validation.output.access_token)
  }

  public async fetchSyncApp (
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
}
