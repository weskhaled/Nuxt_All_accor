<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'

definePageMeta({
  layout: 'main',
})
const chatId = useRouteParams('id')
</script>

<template>
  <div v-if="chatId === 'new'" class="h-full flex flex-col items-center justify-center p-3">
    <!-- new chat  -->
    <h3 class="mb-1 text-lg font-semibold">
      New chat
    </h3>
    <a-input-search size="large" class="max-w-60" placeholder="Search" />
  </div>
  <div v-else class="flex flex-col">
    <div class="flex gap-3 px-3 py-5">
      <div class="shrink-0 rounded-full size-45px">
        <img src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" class="h-full w-full rounded-full object-cover" alt="">
      </div>
      <div class="overflow-hidden text-left">
        <h2 class="truncate text-sm">
          Arder Oghlo <span class="text-xs text-slate-500">9:00</span>
        </h2>
        <div class="mt-2 flex flex-col gap-2">
          <div class="rounded-sm bg-indigo-6/90 px-2 py-1.5">
            <p class="text-sm text-slate-100">
              Let's meet today ?
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- next chat -->
    <div class="flex gap-3 px-3 py-5">
      <div class="shrink-0 rounded-full size-45px">
        <img src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" class="h-full w-full rounded-full object-cover" alt="">
      </div>
      <div class="overflow-hidden text-left">
        <h2 class="truncate text-sm">
          Khaled Oueslati
          <span class="text-xs text-slate-500">9:00</span>
        </h2>
        <div class="mt-2 flex flex-col gap-2">
          <div class="rounded-sm bg-indigo-6/90 px-2 py-1.5">
            <p class="text-sm text-slate-100">
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
            <p class="text-sm">
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
            <p class="text-sm">
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
</template>
