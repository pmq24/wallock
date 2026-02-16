import { inject as vueInject, type InjectionKey } from 'vue'
import Api from '@/api/api'

export const KEY: InjectionKey<Api> = Symbol('ApiProvider')
export const singleton: Api = new Api()
export function inject() {
  const api = vueInject<Api>(KEY)

  if (!api) {
    throw new Error('Api not provided')
  }

  return api
}
