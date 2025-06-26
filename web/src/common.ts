import {
  breakpointsTailwind,
  useBreakpoints as useVueUseBreakpoints,
} from '@vueuse/core'
import { injectApi } from 'providers/api'
import { useRoute, useRouter } from 'vue-router'

export function useCommon () {
  const api = injectApi()
  const route = useRoute()
  const router = useRouter()

  return { api, route, router } as const
}

export function useBreakpoints () {
  const breakpoints = useVueUseBreakpoints(breakpointsTailwind)

  const activeBreakpoint = breakpoints.active()

  return {
    activeBreakpoint,
  }
}
