import { useI18n } from 'vue-i18n'
import * as ApiProvider from '@/api-provider'

export function useCommon() {
  const api = ApiProvider.inject()

  return { api } as const
}

export function useScopedTranslate(scope: string) {
  const i18nInstance = useI18n()

  return function (key: string, count?: number) {
    if (count !== undefined) {
      return i18nInstance.t(`${scope}.${key}`, count)
    } else {
      return i18nInstance.t(`${scope}.${key}`)
    }
  }
}
