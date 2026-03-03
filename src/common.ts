import { useTranslation } from 'i18next-vue'
import * as ApiProvider from '@/api-provider'

export function useCommon() {
  const api = ApiProvider.inject()

  return { api } as const
}

export function useScopedTranslate(scope: string) {
  const { t } = useTranslation()

  return function (key: string, count?: number) {
    if (count !== undefined) {
      return t(`${scope}.${key}`, { count })
    } else {
      return t(`${scope}.${key}`)
    }
  }
}

export type Result<TData, TError> =
  | Readonly<{ ok: true; data: TData }>
  | Readonly<{ ok: false; error: TError }>
