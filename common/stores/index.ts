import { breakpointsTailwind, useBreakpoints, useStorage } from '@vueuse/core'

export const layoutBoxed: Ref<boolean> = useStorage('layout-boxed', false)
export const sideCollapsed: Ref<boolean> = useStorage('side-collapsed', false)
export const sideHidden: Ref<boolean> = useStorage('side-hidden', true)
export const sideFixed: Ref<boolean> = useStorage('side-fixed', false)

export const breakpoints = useBreakpoints(breakpointsTailwind)
export const mdAndLarger = breakpoints.greaterOrEqual('md')
export const smAndSmaller = breakpoints.smallerOrEqual('sm')
export const mdAndSmaller = breakpoints.smallerOrEqual('md')

export const userLang = ref('fr-FR')
