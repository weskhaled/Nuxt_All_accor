<script setup lang="ts">
import enUS from '@arco-design/web-vue/es/locale/lang/en-us'
import frFR from '@arco-design/web-vue/es/locale/lang/fr-fr'
import { appName } from '~/constants'

const locales: any = {
  'en-US': enUS,
  'fr-FR': frFR,
}

const localeProvider = computed(() => {
  return locales['fr-FR'] || enUS
})

useHead({
  title: appName,
})
</script>

<template>
  <VitePwaManifest />
  <a-config-provider :locale="localeProvider">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </a-config-provider>
</template>

<style scoped lang="less">
html {
  @apply bg-light text-dark dark:bg-dark-9 dark:text-light-50;
}
</style>
