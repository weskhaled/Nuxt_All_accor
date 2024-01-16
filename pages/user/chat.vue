<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { v4 as uuid } from 'uuid'

const chatId = useRouteParams('id')

definePageMeta({
  layout: 'main',
  middleware: ['auth'],
})

const chatUsers = ref<any>([
  {
    id: uuid(),
    name: 'Khaled Oueslati',
    isGroup: false,
    lastMessage: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
  },
  {
    id: uuid(),
    name: 'Arder Oghlo',
    isGroup: false,
    lastMessage: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
  },
  {
    id: uuid(),
    name: 'James Rodrigo',
    isGroup: false,
    lastMessage: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
  },
  {
    id: uuid(),
    name: 'WK',
    isGroup: true,
    lastMessage: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
  },
])
onMounted(() => {
  console.log(chatId.value)
})
</script>

<template>
  <NuxtLayout name="user-chat" :hide-sidebar="!!chatId">
    <template #aside>
      <div class="sticky top-0 z-3 h-16.25 flex flex-none items-center justify-between border-b border-gray/15 bg-white/55 p-2 backdrop-blur dark:border-black/65 dark:bg-dark-9/55">
        <div class="flex items-center">
          <h4 class="text-lg font-bold tracking-wide">
            Messages
          </h4>
          <span class="i-iconoir-nav-arrow-down ml-1" />
        </div>
        <span>
          <a-button size="large" type="text" shape="circle" @click="$router.push(`/user/chat/`)">
            <span class="i-iconoir-chat-plus-in text-black size-5 dark:text-white" />
          </a-button>
        </span>
      </div>
      <div class="flex flex-1 flex-col px-2 py-1 space-y-1">
        <div class="sticky top-16.15 z-4 mx--2 mb-1 mt--2 border-b border-gray/35 bg-light-1/90 p-2 backdrop-blur dark:border-black/70 dark:bg-dark-8/20">
          <a-input-search class="!rounded-5" size="large" placeholder="Please enter something" />
        </div>
        <div v-for="user in chatUsers" :key="user.id" role="button" class="chat-user min-h-18 flex cursor-pointer items-center border border-dark-2/10 rounded-1 bg-light-5/35 px-1 py-2 transition-all dark:bg-dark-5/95 hover:bg-blue-3/50 dark:hover:bg-blue-9/50" :class="[user.id === chatId && '!bg-blue-3/50 !dark:bg-blue-9/50']" @click="$router.push(`/user/chat/${user.id}`)">
          <div class="flex flex-row items-center overflow-hidden space-x-1">
            <div class="flex-0 mr-1">
              <template v-if="user.isGroup">
                <div>
                  <div class="flex items-center -space-x-5 rtl:space-x-reverse">
                    <img class="border border-light-5 rounded-full border-solid size-8 dark:border-dark-5" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="">
                    <img class="border border-light-5 rounded-full border-solid size-8 dark:border-dark-5" src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt="">
                    <img class="border border-light-5 rounded-full border-solid size-8 dark:border-dark-5" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" alt="">
                  </div>
                </div>
              </template>
              <span v-else class="relative">
                <a-avatar :size="32" shape="circle" class="!bg-blue-9">
                  <span class="text-xs font-semibold">
                    WK
                  </span>
                </a-avatar>
                <span class="absolute bottom--2 right--0 border-1 border-white rounded-full bg-green-400 size-2 dark:border-gray-800" />
              </span>
            </div>
            <div class="flex-1 overflow-hidden">
              <h3 class="text-4/7 font-semibold tracking-wide">
                {{ user.name }}
              </h3>
              <p class="truncate text-xs">
                {{ user.lastMessage }}
              </p>
            </div>
            <div class="flex flex-none flex-col text-xs space-y-1">
              <div class="flex">
                <div class="flex items-center justify-center">
                  <span class="i-iconoir-double-check block text-green-3 size-4" />
                </div>
                <span class="text-3">
                  4 m
                </span>
              </div>
              <div class="flex">
                <span class="flex items-center justify-center rounded-full bg-red-6 text-3 text-white size-4.5">
                  5
                </span>
                <div class="flex flex-1 items-center justify-center">
                  <span class="i-carbon-attachment block size-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #main-header>
      <div class="sticky top-0 z-9 border-b border-white/20 bg-white/55 backdrop-blur dark:border-black/25 dark:bg-black/55">
        <div class="flex flex-row items-center p-2">
          <a-button
            shape="circle" size="small" class="m-0 mr-2 inline-block flex-none !h-6 !w-6 !border-1px !border-blue !md:hidden"
            type="text" aria-label="Previous" @click="() => $router.push('/user/chat/')"
          >
            <template #icon>
              <span i-carbon-arrow-left class="" />
            </template>
          </a-button>
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
                <img class="border border-light-5 rounded-full border-solid size-8 dark:border-dark-5" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="">
                <img class="border border-light-5 rounded-full border-solid size-8 dark:border-dark-5" src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt="">
                <img class="border border-light-5 rounded-full border-solid size-8 dark:border-dark-5" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" alt="">
                <img class="border border-light-5 rounded-full border-solid size-8 dark:border-dark-5" src="https://flowbite.com/docs/images/people/profile-picture-4.jpg" alt="">
              </div>
            </div>
            <div class="hidden md:flex">
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
      </div>
    </template>
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped lang="less">
</style>
