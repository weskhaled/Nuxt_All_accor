<script setup lang="ts">
import type { Dayjs } from 'dayjs'

const props = withDefaults(defineProps<Props>(), {
  event: () => ref({}),
  selectedEvent: () => ref({}),
  date: null,
  showDuration: false,
})

defineEmits(['mouseDownHandlerEventMove', 'mouseDownHandlerEventResize'])

const { dayjs } = useDayjs()

export interface Props {
  event?: any
  selectedEvent?: any
  date?: Dayjs | null
  showDuration?: boolean
}
</script>

<template>
  <div draggable="false">
    <div class="h-full flex flex-col">
      <div v-if="dayjs(event.start).day() === date?.day()" class="h-full flex flex-col overflow-hidden">
        <div class="event-header mb-1 bg-black/20">
          <slot name="title">
            <h4 class="relative truncate pl-1 pr-6 text-4.2/7">
              {{ event.title }}
            </h4>
          </slot>
        </div>
        <div class="event-content flex-1 overflow-auto p-x-1 text-4">
          <slot name="content">
            <div>
              {{ event.start }}
            </div>
            <div>
              {{ event.end }}
            </div>
          </slot>
        </div>
        <div
          class="hover:bg-slate-3-3 event-dragger absolute right-0 top-0 h-7 w-full flex cursor-grab items-center rounded-bl-2px bg-slate-8/5 transition-all delay-0s group-focus:cursor-grabbing active:bg-slate-8/30"
          @mousedown="(e) => $emit('mouseDownHandlerEventMove', e)"
        />
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
        class="absolute bottom-0 h-1 w-full flex cursor-s-resize items-center bg-slate-2/50 transition-all delay-0.3s active:bg-slate-3 hover:bg-slate-3"
        @mousedown="(e) => $emit('mouseDownHandlerEventResize', e)"
      >
        <span i-carbon-subtract class="mx-auto h-2 w-4 !text-dark-5" />
      </div>
    </div>
  </div>
</template>

<style lang="less"></style>
