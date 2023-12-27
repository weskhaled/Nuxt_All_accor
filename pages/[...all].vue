<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <div p="x4 y10" class="h-[calc(100vh-2.55rem)] flex flex-col justify-center text-center">
    <div text-4xl>
      <div i-carbon-warning inline-block />
    </div>
    <div>Not found</div>
    <div>
      <button text-sm btn m="3 t8" @click="router.back()">
        Back
      </button>
    </div>
  </div>
</template>
