<script setup lang="ts">
const model = defineModel({ type: Boolean, default: false })
</script>

<template>
  <label class="group h-12px w-48px flex cursor-pointer">
    <input v-model="model" type="checkbox" class="peer sr-only">
    <i class="relative h-full w-full flex after:(absolute left-1px top-1/2 h-2px w-1/2 translate-y-[-50%] rotate-[0deg] rounded-6px bg-gray/90 transition-transform content-['']) before:(absolute right-1px top-1/2 h-2px w-1/2 translate-y-[-50%] rotate-[-0deg] rounded-2px bg-gray/90 transition-transform content-['']) group-hover:after:rotate-[10deg] group-hover:before:rotate-[-10deg] group-hover:peer-checked:after:rotate-[-10deg] group-hover:peer-checked:before:rotate-[10deg]" />
  </label>
</template>
