<script setup lang="ts">
definePageMeta({
  layout: 'main',
})
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center p-3">
    <!-- new chat  -->
    <div class="mx-auto w-sm">
      <h3 class="mb-1 text-lg font-semibold">
        New chat
      </h3>
      <a-input-search size="large" class="max-w-60" placeholder="Search" />
    </div>
  </div>
</template>
