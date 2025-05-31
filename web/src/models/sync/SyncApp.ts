import { camelCase, snakeCase } from 'lodash'
import { UnauthorizedError } from './errors'

/**
 * The Sync backend's wrapper - interactions with the Sync backend should go through this.
 */
export default class SyncApp {
  setAccessToken (accessToken: string) {
    this.accessToken = accessToken
  }

  async fetch (
    endpoint: string,
    init: SyncAppRequestInit | undefined = undefined
  ) {
    const res = await fetch(import.meta.env.VITE_SYNC_APP_BASE_URL + endpoint, {
      ...init,
      headers: {
        ...(this.accessToken
          ? { Authorization: `Bearer ${this.accessToken}` }
          : {}),
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      body: init?.body ? JSON.stringify(this.deepSnakeCase(init.body)) : undefined
    })

    if (res.status === 401) {
      this.onUnauthorizedErrorListener.forEach(l => l())
      throw new UnauthorizedError()
    }

    return {
      rawResponse: res,
      payload: res.status !== 204 ? this.deepCamelCase(await res.json()) : undefined
    }
  }

  addOnUnauthorizedErrorListener (listener: () => void) {
    this.onUnauthorizedErrorListener.push(listener)
  }

  private deepSnakeCase (data: any): unknown {
    if (data === null || data === undefined) {
      return undefined
    }

    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        data[i] = this.deepSnakeCase(data[i])
      }

      return data
    }

    if (typeof data === 'object') {
      const newData = {} as Record<keyof typeof data, any>
      const keys = Object.keys(data)

      for (const key of keys) {
        newData[snakeCase(key)] = this.deepSnakeCase(data[key])
      }

      return newData
    }

    return data
  }

  private deepCamelCase (data: any): unknown {
    if (data === null || data === undefined) {
      return undefined
    }

    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        data[i] = this.deepCamelCase(data[i])
      }

      return data
    }

    if (typeof data === 'object') {
      const newData = {} as Record<keyof typeof data, any>
      const keys = Object.keys(data)

      for (const key of keys) {
        newData[camelCase(key)] = this.deepCamelCase(data[key])
      }

      return newData
    }

    return data
  }

  private accessToken?: string
  private onUnauthorizedErrorListener: (() => void)[] = []
}

interface SyncAppRequestInit extends RequestInit {
  body?: any
}
