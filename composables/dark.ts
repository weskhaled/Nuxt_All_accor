export function useDark() {
  const color = useColorMode()
  const isDark = computed(() => useColorMode().value === 'dark')

  useHead({
    meta: [{
      id: 'theme-color',
      name: 'theme-color',
      content: () => color.value === 'dark' ? '#222222' : '#ffffff',
    }],
  })

  function toggleDark() {
    color.preference = color.value === 'dark' ? 'light' : 'dark'

    if (color.preference === 'light')
      document?.body.removeAttribute('arco-theme')

    else
      document?.body.setAttribute('arco-theme', 'dark')
  }

  onMounted(() => {
    if (color.preference === 'light')
      document?.body.removeAttribute('arco-theme')
    else
      document?.body.setAttribute('arco-theme', 'dark')
  })

  return {
    toggleDark,
    color,
    isDark,
  }
}
