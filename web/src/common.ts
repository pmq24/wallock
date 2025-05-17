import {
  breakpointsTailwind,
  useBreakpoints as useVueUseBreakpoints,
} from '@vueuse/core'

export function useBreakpoints () {
  const breakpoints = useVueUseBreakpoints(breakpointsTailwind)

  const activeBreakpoint = breakpoints.active()

  return {
    activeBreakpoint,
  }
}
