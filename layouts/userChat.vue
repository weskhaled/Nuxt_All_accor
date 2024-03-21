<script setup lang="ts">
defineProps<{
  hideSidebar?: boolean
}>()
</script>

<template>
  <div class="h-full flex">
    <div class="relative h-full w-full flex border-white/25 rounded-2px bg-white/50 dark:border-black/35 dark:bg-black/50">
      <aside :class="[hideSidebar && 'translate-x--100% lt-md:absolute']" class="z-2 h-inherit w-full flex-col overflow-hidden overflow-y-auto border-r border-white/25 bg-white/75 shadow-sm transition-all shadow-elevation-3 lg:max-w-85 md:w-80 dark:border-black/35 dark:bg-black/75 !md:flex !md:translate-x-0%">
        <slot name="aside" />
      </aside>

      <main class="z-1 h-inherit w-full flex-1 flex-col overflow-hidden overflow-y-auto bg-[url(https://volta.net/home/cta.png)] bg-white/15 bg-cover bg-no-repeat dark:bg-black/45 !md:relative !md:flex">
        <slot name="main-header" />
        <div class="flex-1">
          <div class="pointer-events-none absolute inset-x-0 top-0 z-2 flex justify-center overflow-hidden">
            <div class="w-[108rem] flex flex-none justify-end opacity-25">
              <picture><source srcset="https://tailwindcss.com/_next/static/media/docs@30.8b9a76a2.avif" type="image/avif"><img src="https://tailwindcss.com/_next/static/media/docs@tinypng.d9e4dcdc.png" alt="" class="max-w-none w-[71.75rem] flex-none dark:hidden" decoding="async"></picture><picture><source srcset="https://tailwindcss.com/_next/static/media/docs-dark@30.1a9f8cbf.avif" type="image/avif"><img src="https://tailwindcss.com/_next/static/media/docs-dark@tinypng.1bbe175e.png" alt="" class="hidden max-w-none w-[90rem] flex-none dark:block" decoding="async"></picture>
            </div>
          </div>
          <div
            class="pointer-events-none absolute inset-x-0 top-0 z-0 flex justify-center overflow-hidden opacity-45"
          >
            <div class="min-w-60rem w-100% flex flex-none justify-end">
              <picture class="">
                <source
                  srcset="
          https://tailwindcss.com/_next/static/media/docs@30.8b9a76a2.avif
        "
                  type="image/avif"
                  class=""
                  style="
"
                >
                <img
                  src="https://tailwindcss.com/_next/static/media/docs@tinypng.d9e4dcdc.png"
                  alt=""
                  class="max-w-none w-[71.75rem] flex-none dark:hidden"
                  decoding="async"
                >
              </picture>
              <picture>
                <source
                  srcset="
          https://tailwindcss.com/_next/static/media/docs-dark@30.1a9f8cbf.avif
        "
                  type="image/avif"
                >
                <img
                  src="https://tailwindcss.com/_next/static/media/docs-dark@tinypng.1bbe175e.png"
                  alt=""
                  class="hidden max-w-none w-[90rem] flex-none dark:block"
                  decoding="async"
                >
              </picture>
            </div>
          </div>
          <div class="chat-content h-full">
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
