<script setup lang="ts">
definePageMeta({
  layout: 'main',
  middleware: ['auth'],
})

const router = useRouter()
const user = useSupabaseUser()
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center bg-light-5/50 dark:bg-dark-7/30">
    <div class="flex flex-col items-center justify-center space-y-3">
      <h1 class="text-3xl/8 font-bold tracking-wide font-sans">
        Welcome to your profile
      </h1>
      <p class="text-lg/6 tracking-wide">
        You are logged in as <span class="font-bold">{{ user?.email }}</span>
      </p>
      <a-button type="primary" size="large" @click="async() => await router.push('/')">
        Go to home page
      </a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
</style>
