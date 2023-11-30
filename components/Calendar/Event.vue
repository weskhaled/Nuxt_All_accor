<script setup lang="ts">
export interface Props {
  event?: Ref<any>
  lang?: string
}
const props = withDefaults(defineProps<Props>(), {
  event: () => ref({}),
  lang: () => 'fr-FR',
})
defineEmits(['mouseDownHandlerEventMove', 'mouseDownHandlerEventResize'])

function toHHMMSS(sec_num: number) {
  const hours = Math.floor(sec_num / 3600)
  const minutes = Math.floor((sec_num - (hours * 3600)) / 60)

  let hoursStr = hours.toString()
  let minutesStr = minutes.toString()

  if (hours < 10)
    hoursStr = `0${hours}`
  if (minutes < 10)
    minutesStr = `0${minutes}`

  return `${hoursStr}h:${minutesStr}m`
}
</script>

<template>
  <div
    :key="event.id"
    class="event left-0 top--1px mx-0 w-[calc(100%-0rem)] cursor-pointer select-none overflow-hidden rounded-2px px-0 opacity-95 !absolute [&_.arco-resizebox-trigger-icon]:my--4px !min-h-22.5px [&_.arco-resizebox-trigger-icon-wrapper]:bg-blue-9 [&_.arco-icon]:text-white"
  >
    <div class="h-full flex items-center justify-center" :style="{ backgroundColor: props.event.color }">
      <div class="h-full w-full flex flex-col select-none justify-between overflow-auto text-left text-3.4/4">
        <div class="">
          <div class="bg-black/20 p-1.2 text-white">
            <p :title="props.event.title" class="line-clamp-2 mb-1 text-3.5 leading-5 capitalize">
              {{ props.event.title }}
            </p>
            <div class="event--date-from-to text-md/4 text-right">
              {{ ((start) => useDateFormat(new Date(start), 'HH:mm', {
                locales: props.lang,
              }).value)(props.event.start) }}
              - {{ ((end) => useDateFormat(end, 'HH:mm', { locales: props.lang }).value)(props.event.end) }}
            </div>
          </div>
        </div>
        <div class="mb-1 text-center">
          <span class="inline-block rounded-1px bg-dark-7 p-0.3 px-0.7 text-3.1/3.5 font-sans text-white">
            <span>{{ toHHMMSS(Math.round((props.event.height) * 3600 / 90)) }}</span>
          </span>
        </div>
      </div>
      <div
        class="absolute right-0 top-0 h-5 w-5 flex cursor-grab items-center rounded-bl-2px bg-slate-2/50 transition-all delay-0s active:cursor-grabbing active:bg-slate-3 hover:bg-slate-3"
        @mousedown="(e) => $emit('mouseDownHandlerEventMove', e)"
      >
        <span i-carbon-data-collection class="mx-auto h-3.5 w-3.5 !text-dark-5" />
      </div>
      <div
        class="absolute bottom-0 h-1 w-full flex cursor-s-resize items-center bg-slate-2/50 transition-all delay-0.3s active:bg-slate-3 hover:bg-slate-3"
        @mousedown="(e) => $emit('mouseDownHandlerEventResize', e)"
      >
        <span i-fluent-line-horizontal-1-20-filled class="mx-auto h-1 w-4 !text-dark-5" />
      </div>
    </div>
  </div>
</template>

<style lang="less"></style>
