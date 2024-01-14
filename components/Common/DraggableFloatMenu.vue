<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'
import { UseDraggable as Draggable } from '@vueuse/components'

interface Props {
  menuItems?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  menuItems: () => [
    {
      key: '1',
      icon: 'i-carbon-idea',
      text: 'Ideas',
      action: () => {
      },
    },
    {
      key: '2',
      icon: 'i-carbon-debug',
      text: 'Bugs',
      action: () => {
      },
    },
  ],
})

const model = defineModel({ type: Boolean, default: false })

const breakpoints = useBreakpoints(breakpointsTailwind)
const { width: windowWidth, height: windowHeight } = useWindowSize()
const mdAndSmaller = computed(() => breakpoints.isSmallerOrEqual('md'))

const handlePopupFloatMenu = ref<HTMLElement | null>(null)
</script>

<template>
  <Draggable
    storage-key="vueuse-draggable" storage-type="session" class="fixed z-1001"
    :initial-value="{ x: windowWidth - 150, y: windowHeight - 150 }" :prevent-default="true"
  >
    <div ref="handlePopupFloatMenu">
      <span
        class="absolute left--5px top--5px z-102 h-5 w-5 flex cursor-grab items-center justify-center rounded-full bg-blue-700 text-10px text-light-50 active:cursor-grabbing"
      >
        <IconDragArrow />
      </span>
    </div>
    <a-trigger
      v-model:popup-visible="model" :trigger="[mdAndSmaller ? 'click' : 'hover']" position="top"
      class="cursor-grab !dark:[&_.arco-menu-item]:bg-dark-9"
    >
      <div :class="`button-trigger ${model ? 'button-trigger-active' : ''}`">
        <span v-if="model" i-carbon-close />
        <span v-else i-carbon-overflow-menu-vertical />
      </div>
      <template #content>
        <a-menu
          :style="{ marginBottom: '-2px' }"
          mode="popButton"
          :tooltip-props="{ mini: true, position: 'left' }"
          show-collapse-button
        >
          <a-menu-item v-for="menuItem in menuItems" :key="menuItem.key" class="flex items-center justify-center !p-0 ![&_.arco-menu-icon]:mr-0 ![&_.arco-menu-title]:hidden ![&.arco-menu-selected>.arco-menu-icon]:text-white" @click="menuItem.action">
            <template #icon>
              <span :class="menuItem.icon" class="inline-block h-4.5 w-4.5" />
            </template>
            {{ menuItem.text }}
          </a-menu-item>
        </a-menu>
      </template>
    </a-trigger>
  </Draggable>
</template>
