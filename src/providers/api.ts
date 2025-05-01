import { inject, type InjectionKey } from 'vue'
import Api from 'models/api'

export const API_PROVIDER_KEY: InjectionKey<Api> = Symbol('Global API object')

export function injectApi () {
  return inject(API_PROVIDER_KEY)!
}

export const api = new Api()
