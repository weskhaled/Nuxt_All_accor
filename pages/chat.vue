<script setup lang="ts">
definePageMeta({
  layout: 'main',
  middleware: ['auth'],
})
</script>

<template>
  <div class="h-full flex">
    <div class="h-full w-full flex border-white/25 rounded-2px bg-white/50 dark:border-black/35 dark:bg-black/50">
      <aside class="shadow-elevation-3 w-50 flex flex-col overflow-hidden overflow-y-auto border-r border-white/25 bg-white/60 shadow-sm lg:w-80 dark:border-black/35 dark:bg-black/60">
        <div>
          <div class="sticky top-0 z-3 mb-2 h-16.25 flex flex-none items-center justify-between border-b border-white/25 bg-white/55 p-2 backdrop-blur dark:border-black/25 dark:bg-dark-9/55">
            <div class="flex items-center">
              <h4 class="text-lg font-bold tracking-wide">
                Messages
              </h4>
              <span class="i-iconoir-nav-arrow-down ml-1" />
            </div>
            <span>
              <a-button size="large" type="text" shape="circle">
                <span class="i-iconoir-chat-plus-in size-5 text-black dark:text-white" />
              </a-button>
            </span>
          </div>
          <div class="flex flex-1 flex-col px-2 pb-2 space-y-1">
            <div class="sticky top-16.15 z-4 mx--2 mt--2 border-b bg-light-8/20 p-2 backdrop-blur dark:border-dark-9 dark:bg-dark-8/20">
              <a-input-search class="!rounded-5" size="large" placeholder="Please enter something" />
            </div>
            <div v-for="i in 100" :key="i" class="chat-user min-h-18 flex cursor-pointer items-center rounded-1 bg-light-5/35 px-1 py-2 transition-all dark:bg-dark-5/95 hover:bg-blue-3/80 dark:hover:bg-blue-9/80">
              <div class="flex flex-row items-center overflow-hidden space-x-1">
                <div class="flex-0 mr-1">
                  <template v-if="i === 2">
                    <div>
                      <div class="flex items-center -space-x-5 rtl:space-x-reverse">
                        <img class="size-8 border border-light-5 rounded-full border-solid dark:border-dark-5" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="">
                        <img class="size-8 border border-light-5 rounded-full border-solid dark:border-dark-5" src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt="">
                        <img class="size-8 border border-light-5 rounded-full border-solid dark:border-dark-5" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" alt="">
                      </div>
                    </div>
                  </template>
                  <span v-else class="relative">
                    <a-avatar :size="32" shape="circle" class="!bg-blue-9">
                      <span class="font-semibold">
                        WK
                      </span>
                    </a-avatar>
                    <span class="size-2 absolute left--0 top--1 border-1 border-white rounded-full bg-green-400 dark:border-gray-800" />
                  </span>
                </div>
                <div class="flex-1 overflow-hidden">
                  <h3 class="text-4/7 font-semibold tracking-wide">
                    {{ i === 2 ? 'Office Chat' : `John Doe ${i + 1}` }}
                  </h3>
                  <p class="truncate text-xs">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.
                  </p>
                </div>
                <div class="flex flex-none flex-col text-xs space-y-1">
                  <div class="flex">
                    <div class="flex items-center justify-center">
                      <span class="i-iconoir-double-check size-4 block text-green-3" />
                    </div>
                    <span class="text-3">
                      4 m
                    </span>
                  </div>
                  <div class="flex">
                    <span class="size-4.5 flex items-center justify-center rounded-full bg-red-6 text-3 text-white">
                      5
                    </span>
                    <div class="flex flex-1 items-center justify-center">
                      <span class="i-carbon-attachment size-3.5 block" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <main class="w-full flex flex-1 flex-col overflow-hidden">
        <div class="sticky top-0 z-9 border-b border-white/20 bg-white/55 backdrop-blur dark:border-black/25 dark:bg-black/55">
          <div class="flex flex-row items-center p-2">
            <div class="flex-1">
              <h2 class="inline-block text-xl/8 font-medium font-semibold tracking-wide">
                Office Chat
              </h2>
              <p class="text-xs text-gray-7 dark:text-gray-3">
                Online 3 min ago
              </p>
            </div>
            <div class="flex-0 flex space-x-2">
              <div>
                <div class="flex items-center -space-x-4 rtl:space-x-reverse">
                  <img class="size-8 border border-light-5 rounded-full border-solid dark:border-dark-5" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="">
                  <img class="size-8 border border-light-5 rounded-full border-solid dark:border-dark-5" src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt="">
                  <img class="size-8 border border-light-5 rounded-full border-solid dark:border-dark-5" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" alt="">
                  <img class="size-8 border border-light-5 rounded-full border-solid dark:border-dark-5" src="https://flowbite.com/docs/images/people/profile-picture-4.jpg" alt="">
                </div>
              </div>
              <a-button type="text" shape="circle">
                <span class="i-carbon-search" />
              </a-button>
              <a-button type="text" shape="circle">
                <span class="i-carbon-phone" />
              </a-button>
              <a-button type="text" shape="circle">
                <span class="i-carbon-open-panel-right" />
              </a-button>
              <a-button type="text" shape="circle">
                <span class="i-carbon-overflow-menu-vertical" />
              </a-button>
            </div>
          </div>
        </div>
        <div class="flex-1 bg-white/45 dark:bg-black/45">
          <div class="pointer-events-none absolute inset-x-0 top-0 z-2 flex justify-center overflow-hidden">
            <div class="w-[108rem] flex flex-none justify-end opacity-25">
              <picture><source srcset="https://tailwindcss.com/_next/static/media/docs@30.8b9a76a2.avif" type="image/avif"><img src="https://tailwindcss.com/_next/static/media/docs@tinypng.d9e4dcdc.png" alt="" class="max-w-none w-[71.75rem] flex-none dark:hidden" decoding="async"></picture><picture><source srcset="https://tailwindcss.com/_next/static/media/docs-dark@30.1a9f8cbf.avif" type="image/avif"><img src="https://tailwindcss.com/_next/static/media/docs-dark@tinypng.1bbe175e.png" alt="" class="hidden max-w-none w-[90rem] flex-none dark:block" decoding="async"></picture>
            </div>
          </div>
          <div class="chat-content">
            <div class="flex flex-col">
              <div class="flex gap-3 px-3 py-5">
                <div class="size-45px shrink-0 rounded-full">
                  <img src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" class="h-full w-full rounded-full object-cover" alt="">
                </div>
                <div class="overflow-hidden text-left">
                  <h2 class="truncate text-sm">
                    Arder Oghlo <span class="text-xs text-slate-500">9:00</span>
                  </h2>
                  <div class="mt-2 flex flex-col gap-2">
                    <div class="rounded-sm bg-indigo-6/90 px-2 py-1.5">
                      <p class="truncate text-sm text-slate-100">
                        Let's meet today ?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- next chat -->
              <div class="flex gap-3 px-3 py-5">
                <div class="size-45px shrink-0 rounded-full">
                  <img src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" class="h-full w-full rounded-full object-cover" alt="">
                </div>
                <div class="overflow-hidden text-left">
                  <h2 class="truncate text-sm">
                    Khaled Oueslati
                    <span class="text-xs text-slate-500">9:00</span>
                  </h2>
                  <div class="mt-2 flex flex-col gap-2">
                    <div class="rounded-sm bg-indigo-6/90 px-2 py-1.5">
                      <p class="truncate text-sm text-slate-100">
                        Yes sure
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- response -->
              <div class="flex flex-row-reverse gap-3 px-3 py-5 text-right">
                <div class="h-[45px] w-[45px] shrink-0 rounded-full">
                  <img src="https://flowbite.com/docs/images/people/profile-picture-1.jpg" class="h-full w-full rounded-full object-cover" alt="">
                </div>
                <div class="overflow-hidden">
                  <h2 class="truncate text-sm">
                    James Rodrigo <span class="text-xs text-slate-5">9:01</span>
                  </h2>
                  <div class="mt-2 flex flex-col justify-start gap-2">
                    <div class="max-w-fit overflow-hidden rounded-sm bg-light-3 px-2 py-1.5 dark:bg-dark-8">
                      <p class="truncate text-sm">
                        Ok in just a 5 min i will be there be ready in the time 😉
                      </p>
                    </div>
                    <div class="grid grid-cols-6 grid-rows-6 h-64 gap-2 rounded-md">
                      <img src="https://picsum.photos/1040/1010" alt="" class="col-span-3 row-span-3 h-full w-full rounded-sm object-cover">
                      <img src="https://picsum.photos/1140/1010" alt="" class="col-span-3 row-span-3 h-full w-full rounded-sm object-cover">
                      <img src="https://picsum.photos/1640/1010" alt="" class="col-span-3 row-span-3 h-full w-full rounded-sm object-cover">
                      <img src="https://picsum.photos/1340/1010" alt="" class="col-span-3 row-span-3 h-full w-full rounded-sm object-cover">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped lang="less">
</style>
