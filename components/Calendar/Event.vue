<script setup lang="ts">
import type { Dayjs } from 'dayjs'

export interface Props {
  event?: any
  selectedEvent?: any
  date?: Dayjs | null
  showDuration?: boolean
  isDraggable?: boolean
  isResizable?: boolean
}

withDefaults(defineProps<Props>(), {
  event: () => ref({}),
  selectedEvent: () => ref({}),
  date: null,
  showDuration: false,
  isDraggable: false,
  isResizable: false,
})

defineEmits(['mouseDownHandlerEventMove', 'mouseDownHandlerEventResize', 'viewMoreHandler'])

const { dayjs } = useDayjs()
</script>

<template>
  <div draggable="false">
    <div class="h-full flex flex-col">
      <div v-if="dayjs(event.start).day() === date?.day()" class="h-full flex flex-col overflow-hidden">
        <div class="event-header relative mb-0 flex justify-between overflow-hidden truncate border-b border-dark/45 text-3.5/6 before:(absolute top-0 z--1 h-full w-full rounded-tr-2px bg-black/30 content-['']) dark:border-dark-6/60">
          <slot name="title">
            <h4 class="truncate pl-0.5 font-semibold">
              {{ event.title }}
            </h4>
          </slot>
          <span
            class="block h-full w-6 flex flex-none select-none items-center justify-center rounded-tr-2px bg-black/25 text-3.1/7 text-white"
          >
            <button class="i-carbon-overflow-menu-horizontal h-full w-full" @mousedown="$emit('viewMoreHandler', event)" />
          </span>
          <div
            v-if="isDraggable"
            class="event-dragger absolute left-0 top-0 h-full w-[calc(100%-1.5rem)] flex cursor-grab items-center rounded-bl-2px bg-slate-8/5 transition-all delay-0s group-focus:cursor-grabbing active:bg-slate-6/10 hover:bg-slate-6/10"
            @mousedown="(e) => $emit('mouseDownHandlerEventMove', e)"
          />
        </div>
        <div class="event-content flex-1 overflow-auto p-x-0.5 pb-2px text-3.8/5 dark:bg-dark-7/75">
          <slot name="content" />
        </div>
      </div>

      <span
        v-if="showDuration"
        class="absolute top--4 block w-auto select-none rounded-2px rounded-b-0 bg-dark-7 p-0.3 px-0.7 text-3.1/3.5 text-white font-mono"
      >
        <span>
          {{
            dayjs.duration(dayjs(event.end).diff(dayjs(event.start))).format(+dayjs.duration(dayjs(event.end).diff(dayjs(event.start))).format('DD')
              > 0 ? 'D, HH:mm' : 'HH:mm')
          }}
        </span>
      </span>

      <div
        v-if="isResizable"
        class="absolute bottom-0 h-1 w-full flex cursor-s-resize items-center bg-slate-2/50 transition-all delay-0.3s active:bg-slate-3 hover:bg-slate-3"
        @mousedown="(e) => $emit('mouseDownHandlerEventResize', e)"
      >
        <span i-carbon-subtract class="mx-auto h-3 w-4 !text-dark-5" />
      </div>
    </div>
  </div>
</template>

<style lang="less">
</style>
