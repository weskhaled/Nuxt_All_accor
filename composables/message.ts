import type { Message } from '@arco-design/web-vue'

export function useMessage() {
  const { $message } = getCurrentInstance()?.appContext?.config?.globalProperties

  return {
    message: $message as Message || console,
  }
}
