import { useTranslation } from 'i18next-vue'
import * as ApiProvider from '@/api-provider'
import { ref } from 'vue'
import { useAsyncState } from '@vueuse/core'

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

export type Okable<TData, TError> =
  | Readonly<{ ok: true; data: TData }>
  | Readonly<{ ok: false; error: TError }>

export function useForm<
  TData extends Record<string, unknown>,
  TResult extends unknown,
  TError extends unknown
>(opts: {
  initialValues: TData,
  validate: (data: TData) => Promise<Okable<TData, TError>>,
  submit: (data: TData) => Promise<Okable<TResult, TError>>,
}) {
  const data = ref(opts.initialValues)

  const {state: submission, execute: submit} = useAsyncState(
    () => opts.submit(data.value),
    undefined,
    {
      immediate: false,
    }
  )

  return {
    data,
    submit,
    extractError(extractor: (error: TError) => string) {

    }
  }
}
