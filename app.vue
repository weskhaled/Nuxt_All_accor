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
  <div>
    <NuxtLayout>
      <a-config-provider :locale="localeProvider">
        <NuxtPage />
      </a-config-provider>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="less">
</style>
