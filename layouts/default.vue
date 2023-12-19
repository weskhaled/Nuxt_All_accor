<script setup lang="ts">
// import { promiseTimeout } from '@vueuse/core'
import { layoutBoxed } from '~/common/stores/index'

// await promiseTimeout(120000)
</script>

<template>
  <a-layout class="relative w-full font-sans">
    <a-layout>
      <a-layout-header class="5xl:container fixed z-99 mx-auto w-full bg-white/75 backdrop-blur backdrop-filter dark:bg-black/75" :class="[layoutBoxed ? 'md:container' : 'w-full']">
        <LayoutHeader />
      </a-layout-header>
      <a-layout class="ml-0 flex flex-col transition-margin">
        <a-layout-content id="layoutMain" class="relative h-full overflow-hidden">
          <slot />
        </a-layout-content>
      </a-layout>
      <a-layout-footer class="flex-0 hidden w-full md:block">
        <LayoutFooter />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style lang="less" scoped>
</style>
