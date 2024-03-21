<script setup lang="ts">
// import { promiseTimeout } from '@vueuse/core'

const { y: windowScrollY } = useWindowScroll()

// await promiseTimeout(120000)
</script>

<template>
  <a-layout class="relative w-full font-sans">
    <a-layout>
      <a-layout-header
        class="5xl:container fixed z-99 mx-auto w-full border-b border-zinc-3/10 backdrop-blur backdrop-filter transition-all"
        :class="[windowScrollY > 200 ? 'xl:py-0 bg-white/75 dark:bg-black/75' : 'xl:py-5 bg-white/35 dark:bg-black/35']"
      >
        <LayoutHeader class="container" :class="[windowScrollY > 200 && 'containers']" />
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
