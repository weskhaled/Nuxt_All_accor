<script setup lang="ts">
import { useVirtualList } from '@vueuse/core'
import Event from './Event.vue'
import { mdAndLarger, mdAndSmaller, userLang } from '~/common/stores'

interface Props {
  events?: Array<any>
}

const props = withDefaults(defineProps<Props>(), {
  events: () => [],
})

const emit = defineEmits(['eventChanged'])

const { x: xMouse, y: yMouse } = useMouse({ type: 'client' })
const { dayjs } = useDayjs()
const timestamp = useTimestamp({ offset: 0 })
const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const dragHandlerEventResizeRef = ref<EventTarget | null>()
const dragHandlerEventMoveRef = ref<EventTarget | null>()
const timeIndicatorTop = ref<number>(0)
// let cleanUp: () => void
const coefficient = 1000 * 60 * 5

const daysInYear = computed(() => {
  const year = dayjs(selectedDate.value).year()
  return ((year % 4 === 0 && year % 100 > 0) || year % 400 === 0) ? 366 : 365
})

const allItems = computed(() => {
  return Array.from(Array(daysInYear.value)).map((__d, index) => {
    const date = dayjs(dayjs(`${dayjs(selectedDate.value).year()}-01-01`).dayOfYear(index + 1))

    return {
      events: props.events
        .filter(ev => date.isBetween(dayjs(ev.start), dayjs(ev.end).subtract(1, 'minute'), 'date', '[]'))
        .map(ev => ({
          ...ev,
          top: dayjs(ev.end).diff(dayjs(ev.start), 'day') > 0 && (dayjs(ev.start).date() !== date.date()) ? 0 : Math.round((+dayjs(ev.start).hour() * 90) + ((+dayjs(ev.start).minute() * 90) / 60)),
          duration: dayjs(ev.end).diff(dayjs(ev.start), 'minute'),
          height: Math.round((((dayjs(ev.end).diff(dayjs(ev.start).set('date', date.date()), 'minute')) + (dayjs(ev.end).diff(dayjs(ev.start), 'day') > 0 ? (dayjs(ev.start).set('date', date.date()).diff(date.set('hour', 0).set('minute', 0), 'minute') - 0) : 0)) * 90 / 60)),
        })),
      index: index + 1,
      date,
    }
  })
})

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  allItems,
  {
    itemWidth: 280,
  },
)
const { y: yContainerRef } = useScroll(containerProps.ref)
const { isOutside } = useMouseInElement(containerProps.ref)
const { x, y } = useMouse({ target: containerProps.ref, type: 'client' })
const { pressed } = useMousePressed()
const { element } = useElementByPoint({ x, y })

const selectedEventRef = computed(() => {
  const targetClicked: any = dragHandlerEventMoveRef.value || dragHandlerEventResizeRef.value

  return targetClicked ? targetClicked.closest('.event') : null
})
const eventDragOrResize = computed(() => {
  return dragHandlerEventMoveRef.value ? 'DRAG' : (dragHandlerEventResizeRef.value ? 'RESIZE' : null)
})
const selectedEventByRef = computed({
  get() {
    return selectedEventRef.value ? props.events.find(event => `${event.id}` === `${selectedEventRef.value?.dataset.event_id}`) : null
  },
  set(newValue) {
    if (!newValue)
      return

    const fundedEvent = props.events.find(event => event.id === newValue.id)

    if (fundedEvent) {
      fundedEvent.end = newValue?.end
      fundedEvent.height = newValue?.height
    }
  },
})

watch([selectedEventRef, pressed, yMouse], ([selectedEventRefValue, pressedValue, yMouseValue]) => {
  if (selectedEventRefValue && pressedValue && selectedEventByRef.value) {
    if (eventDragOrResize.value === 'RESIZE') {
      containerProps.ref?.value?.classList?.add('event--resize')
      selectedEventRefValue.classList.add('in--resize')
      const { start } = selectedEventByRef.value
      const durationFromMouseY = (((Math.round((yMouseValue) - (useElementBounding(selectedEventRef).y.value - 0))) * 60 / 90) * 60000)
      const eventDuration = new Date(Math.round(new Date(new Date(start).getTime() + durationFromMouseY).getTime() / coefficient) * coefficient).getTime() - new Date(start).getTime()
      selectedEventByRef.value.end = dayjs((dayjs(start)))
        .add(eventDuration, 'millisecond')
        .second(0).format('YYYY-MM-DD HH:mm:ss')
    }
    else if (eventDragOrResize.value === 'DRAG') {
      containerProps.ref?.value?.classList?.add('event--move')
      selectedEventRefValue.classList.add('in--move')
      const { date, col_time } = element.value?.dataset
      if (!date || !col_time)
        return

      const dateTime = dayjs(`${date} ${col_time}`)
      const { start } = selectedEventByRef.value

      selectedEventByRef.value.start = dayjs(start)
        .set('month', dateTime.month())
        .set('date', dateTime.date())
        .set('hour', dateTime.hour())
        .set('minute', dateTime.minute())
        .format('YYYY-MM-DD HH:mm:ss')

      const duration = dayjs(dayjs(selectedEventByRef.value.end).set('date', dateTime.date()))
        .diff((dayjs(selectedEventByRef.value.start)), 'minute')
      selectedEventByRef.value.end = dayjs(selectedEventByRef.value.start).add(duration < 30 ? 30 : duration, 'minute').format('YYYY-MM-DD HH:mm:ss')
    }
  }
})

watch(pressed, (value) => {
  if (!value) {
    selectedEventRef.value?.classList?.remove('in--resize')
    selectedEventRef.value?.classList?.remove('in--move')
    containerProps.ref?.value?.classList?.remove('event--move')
    containerProps.ref?.value?.classList?.remove('event--resize')
    dragHandlerEventResizeRef.value = null
    dragHandlerEventMoveRef.value = null
  }
})

watch(isOutside, (value) => {
  if (!value) {
    selectedEventRef.value?.classList?.remove('in--resize')
    selectedEventRef.value?.classList?.remove('in--move')
    containerProps.ref?.value?.classList?.remove('event--move')
    containerProps.ref?.value?.classList?.remove('event--resize')
    dragHandlerEventResizeRef.value = null
    dragHandlerEventMoveRef.value = null
  }
})

function updateTimeIndicator() {
  const hour = dayjs().hour()
  const minute = dayjs().minute()
  const top = ((hour) * 90) + (minute * 90 / 60) + 32
  timeIndicatorTop.value = +top.toFixed(2)
}

useIntervalFn(() => {
  updateTimeIndicator()
}, 60000)

watch(selectedDate, (value) => {
  scrollTo(dayjs(value).dayOfYear() - 1)
})

onMounted(async () => {
  updateTimeIndicator()
  await nextTick()
  scrollTo(dayjs(selectedDate.value).dayOfYear() - 1)
  // console.log(dayjs.duration(100))
  // const e = props.events[0]
  // const date = dayjs(dayjs(`${dayjs(selectedDate).year()}-01-01`).dayOfYear(2))
  // const test = date.isBetween(dayjs(e.start), dayjs(e.end), 'day', '[]')
  // console.log(date.format('YYYY-MM-DD'))
  // console.log(dayjs(e.start).format('YYYY-MM-DD'))
  // console.log(dayjs(e.end).format('YYYY-MM-DD'))
  // console.log(test)
  // scrollTo(88)
})
</script>

<template>
  <div class="flex-0 bg-slate-2 p-0 dark:bg-slate-7">
    <div class="flex flex-col">
      <div
        class="grid grid-cols-12 w-full flex flex-nowrap select-none items-center justify-between overflow-auto overflow-y-hidden border-b-1px border-zinc-4/15 bg-white/15 px-2 py-4 text-center text-3 font-600 !hidden dark:bg-black/15"
      >
        <a
          v-for="(month, index) in 12" :key="month" href="javascript;"
          class="relative w-auto cursor-pointer px-1 capitalize"
        >
          <span
            v-if="index === 12"
            class="absolute bottom--1 right-[calc(50%-0.25rem)] mx-auto h-1 w-1 rounded-full bg-blue-5"
          />
          {{ month }}
        </a>
      </div>
      <a-date-picker
        v-model="selectedDate" value-format="YYYY-MM-DD" format="YYYY-MM-DD"
      >
        <h3 class="flex px-2 text-2xl/12 font-semibold capitalize">
          {{ dayjs(selectedDate).format('DD MMMM, YYYY') }}
        </h3>
      </a-date-picker>
    </div>
  </div>
  <div class="z-2 h-full flex flex-1 flex-col bg-light-1 dark:bg-dark-9">
    <div
      class="z-9 flex flex-nowrap select-none snap-x snap-proximity items-center items-center overflow-auto overflow-y-hidden bg-white/75 text-center dark:bg-black/75"
    >
      <div
        v-for="month in Array.from({ length: 12 }, (_, i) => i)" :key="month"
        class="relative mx-5 min-w-50 snap-center p-x-1.5 py-3 pb-3.2 text-center"
      >
        <a-badge
          class="w-full"
          :count="events.filter(ev => dayjs().set('date', 1).set('month', month).isBetween(dayjs(ev.start), dayjs(ev.end), 'month', '[]')).length"
        >
          <a-button
            type="primary" shape="round" long class="!bg-blue/30"
            @click="() => selectedDate = dayjs(selectedDate).set('date', 1).set('month', month).format('YYYY-MM-DD')"
          >
            <span class="tracking-0.5 capitalize text-black !font-600 dark:text-white">
              {{ dayjs().set('month', month).format('MMMM') }}
            </span>
          </a-button>
        </a-badge>
        <span class="absolute bottom--0.75 right-[calc(50%-0.25rem)] mx-auto hidden h-2 w-2 rounded-full bg-blue-5" />
      </div>
    </div>
    <div class="relative flex flex-auto border-t-0px border-gray-2/20">
      <div
        class="content-stretch relative ml-0 h-[calc(100vh-9.15rem)] min-h-92 flex flex-auto flex-nowrap items-stretch overflow-auto overflow-auto"
      >
        <div v-bind="containerProps" class="calendar--container z-8 h-full">
          <div v-bind="wrapperProps" id="days-per-year" class="relative min-h-0 min-w-0 inline-flex flex-auto before-z-4">
            <span
              class="time-indicator pointer-events-none absolute z-70 block h-1px w-full bg-green/45"
              :style="{ top: `${timeIndicatorTop}px` }"
            />
            <div class="sticky left-0 z-99 h-full select-none">
              <div
                class="time-fixed-side relative left-0 z-10 mt-8 min-w-11 w-11 flex flex-col text-3"
              >
                <span
                  class="absolute left-0 top--8 z-9 h-8.25 w-11 border-b-1px border-r-1px border-zinc-2/30 bg-slate-2/30 backdrop-blur dark:border-zinc-6/30 dark:bg-slate-8/30"
                />
                <div
                  v-for="time in Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}`)" :key="time"
                  class="min-h-90px border-r-1px border-zinc-3/30 bg-slate-2/30 text-center backdrop-blur dark:border-zinc-6/30 dark:bg-slate-8/30"
                >
                  <span class="top-8.5 mt--2.5 block bg-white p-1 text-2.6/3 dark:bg-dark" :class="{ hidden: time === '00' }">
                    {{ time }} {{ +time < 12 ? 'AM' : 'PM' }} </span>
                </div>
              </div>
            </div>
            <div
              v-for="item in list" :id="`${item.index + 1}`" :key="item.index"
              class="day inline-table !w-70"
            >
              <div class="relative h-auto w-full">
                <div class="flex-0 sticky top-0 z-80 select-none px-0 uppercase">
                  <div
                    class="flex items-center justify-between border-b-1px border-zinc-4/25 bg-light-5/85 px-2 text-3.8/8 capitalize dark:bg-dark-8/85"
                  >
                    {{ item.data.date.format('dddd DD, MMMM') }}
                    <div class="flex-0 flex items-center">
                      <a
                        v-for="event in item.data.events" :key="event.id" href="javascript:;"
                        class="m-x-0.5 inline-block h-2 w-2 border-1px border-white rounded-full dark:border-black"
                        :style="{ backgroundColor: event.color }"
                        @click.stop="() => yContainerRef = dayjs(event.start).day() === item.data.date.day() ? +(dayjs(event.start).hour() * 90) : 0"
                      />
                    </div>
                  </div>
                </div>
                <div class="relative mx-1 overflow-hidden">
                  <div class="relative mx-auto w-full bg-blue-5/2 px-1 text-center">
                    <div
                      v-for="time in Array.from({ length: 24 }, (_, i) => i)" :key="time"
                      class="relative h-90px flex flex-col p-0"
                    >
                      <div
                        :data-date="item.data.date.format('YYYY-MM-DD')"
                        :data-col_time="item.data.date.set('hour', time).set('minute', 0).set('second', 0).format('HH:mm:ss')"
                        class="h-1/2 border-b-1px border-blue-6/20 border-dashed"
                      >
                        <span />
                      </div>
                      <div
                        :data-date="item.data.date.format('YYYY-MM-DD')"
                        :data-col_time="item.data.date.set('hour', time).set('minute', 30).set('second', 0).format('HH:mm:ss')"
                        class="h-1/2 border-b-1px border-blue-6/40" :class="{ '!border-b-0': time === 23 }"
                      >
                        <span />
                      </div>
                    </div>
                  </div>
                  <!-- events -->
                  <div class="events-card">
                    <div
                      v-for="event in item.data.events" :key="event.id" :data-event_id="event.id"
                      :data-date="item.data.date" draggable="false"
                      :style="{ top: `${event.top}px`, height: `${event.height}px`, backgroundColor: event.color }"
                      :class="[dayjs(event.start).day() === item.data.date.day() ? 'rounded-2px' : 'rounded-b-2px']"
                      class="event"
                    >
                      <div class="h-full flex flex-col">
                        <div
                          v-if="dayjs(event.start).day() === item.data.date.day()"
                          class="h-full flex flex-col select-none"
                        >
                          <div class="event-header bg-black/20">
                            <h4 class="truncate pl-1 pr-6 text-4.2/7">
                              {{ event.title }}
                            </h4>
                          </div>
                          <div class="event-content flex-1 overflow-auto p-1 text-4">
                            <span>
                              {{ event.title }}
                            </span>
                            <div>
                              {{ event.start }}
                            </div>
                            <div>
                              {{ event.end }}
                            </div>
                            <div>
                              {{ event.duration }}
                            </div>
                          </div>
                          <div
                            class="hover:bg-slate-3-3 absolute right-0 top-0 h-6 w-6 flex cursor-grab items-center rounded-bl-2px bg-slate-2/50 transition-all delay-0s group-focus:cursor-grabbing active:bg-slate-3"
                            @mousedown="(e) => dragHandlerEventMoveRef = e.target"
                          >
                            <span class="mx-auto h-4.5 w-4.5 !text-dark-5">
                              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
                                <path
                                  fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                  stroke-width="1.5"
                                  d="M12 12L4 4m0 0v4m0-4h4m4 8l8-8m0 0v4m0-4h-4m-4 8l-8 8m0 0v-4m0 4h4m4-8l8 8m0 0v-4m0 4h-4"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                        <div class="absolute bottom-0 mb-1 w-full select-none text-center">
                          <span class="inline-block rounded-2px rounded-b-0 bg-dark-7 p-0.3 px-0.7 text-3.1/3.5 font-sans text-white">
                            <span>{{
                              dayjs.duration(dayjs(event.end).diff(dayjs(event.start))).format(+dayjs.duration(dayjs(event.end).diff(dayjs(event.start))).format('DD')
                                > 0 ? 'D, HH:mm' : 'HH:mm') }}</span>
                          </span>
                        </div>
                        <div
                          class="absolute bottom-0 h-1 w-full flex cursor-s-resize items-center bg-slate-2/50 transition-all delay-0.3s active:bg-slate-3 hover:bg-slate-3"
                          @mousedown="(e) => dragHandlerEventResizeRef = e.target"
                        >
                          <span i-carbon-subtract class="mx-auto h-2 w-4 !text-dark-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.calendar--container {
  .events-card {
      @apply absolute top-0 w-full h-full;
      .event {
        @apply absolute group left-0 min-h-max w-full flex-1 overflow-hidden pb-2px text-white;
        &.in--move {
          @apply opacity-90;
        }
      }
  }
  &.event--move {
    @apply cursor-grabbing;

    .event {
      @apply !pointer-events-none cursor-grabbing transition-all-0;
    }

    .events-card {
      @apply absolue top-0 w-full h-full;
      @apply !pointer-events-none;
    }
  }
}
</style>
