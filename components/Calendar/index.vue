<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { breakpointsTailwind, useVirtualList } from '@vueuse/core'
import { useRouteHash } from '@vueuse/router'
import Event from './Event.vue'

const emit = defineEmits(['addNewEvent', 'eventChanged'])
const events = defineModel('events', {
  type: Array<any>,
  default: () => [],
})
const modelValue = defineModel<object | null>({ required: false })

const routeHash = useRouteHash()
const breakpoints = useBreakpoints(breakpointsTailwind)
const { y: yMouse } = useMouse({ type: 'client' })
const { dayjs } = useDayjs()

const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const dragHandlerEventResizeRef = ref<EventTarget | null>()
const monthListRef = ref<HTMLElement | null>()
const dragHandlerEventMoveRef = ref<EventTarget | null>()
const selectedEvent = ref<any>(null)
const timeIndicatorTop = ref<number>(0)

const { pressed } = useMousePressed()
const { x: xMonthListRef } = useScroll(monthListRef)
const { width: widthMonthListRef } = useElementSize(monthListRef)

const coefficient = 1000 * 60 * 5

const daysInYear = computed(() => {
  const year = dayjs(selectedDate.value).year()
  return ((year % 4 === 0 && year % 100 > 0) || year % 400 === 0) ? 366 : 365
})

const allItems = computed(() => {
  return Array.from(Array(daysInYear.value)).map((__d, index) => {
    const date = dayjs(dayjs(`${dayjs(selectedDate.value).year()}-01-01`).dayOfYear(index + 1))

    return {
      events: events.value
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
    overscan: 16,
    itemWidth: 280,
  },
)

const { y: yContainerRef } = useScroll(containerProps.ref)
const { isOutside } = useMouseInElement(containerProps.ref)
const { x, y } = useMouse({ target: containerProps.ref, type: 'client' })
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
    return selectedEventRef.value ? events.value.find(event => `${event.id}` === `${selectedEventRef.value?.dataset.event_id}`) : null
  },
  set(newValue) {
    if (!newValue)
      return

    const fundedEvent = events.value.find(event => event.id === newValue.id)

    if (fundedEvent) {
      fundedEvent.end = newValue?.end
      fundedEvent.height = newValue?.height
    }
  },
})

watch([selectedEventRef, pressed, yMouse], async ([selectedEventRefValue, pressedValue, yMouseValue]) => {
  await nextTick()
  if (selectedEventRefValue && pressedValue && selectedEventByRef.value) {
    if (eventDragOrResize.value === 'RESIZE') {
      containerProps.ref?.value?.classList?.add('event--resize')
      selectedEventByRef.value.inResize = true
      const { start } = selectedEventByRef.value
      const durationFromMouseY = (((Math.round((yMouseValue) - (useElementBounding(selectedEventRef).y.value - 2))) * 60 / 90) * 60000)
      const eventDuration = new Date(Math.round(new Date(new Date(start).getTime() + durationFromMouseY).getTime() / coefficient) * coefficient).getTime() - new Date(start).getTime()

      selectedEventByRef.value.end = dayjs((dayjs(start)))
        .add(eventDuration > 0 ? eventDuration : 0, 'millisecond')
        .second(0).format('YYYY-MM-DD HH:mm:ss')
    }
    else if (eventDragOrResize.value === 'DRAG') {
      containerProps.ref?.value?.classList?.add('event--move')
      selectedEventByRef.value.inMove = true
      const { date, col_time } = element.value?.dataset || {}
      if (!date || !col_time)
        return

      const dateTime = dayjs(`${date} ${col_time}`)
      const { start } = selectedEventByRef.value
      const { duration } = selectedEvent.value

      selectedEventByRef.value.start = dayjs(start)
        .set('month', dateTime.month())
        .set('date', dateTime.date())
        .set('hour', dateTime.hour())
        .set('minute', dateTime.minute())
        .format('YYYY-MM-DD HH:mm:ss')
      if (
        dayjs(selectedEventByRef.value.start).add(duration, 'minute').date()
        === dayjs(selectedEventByRef.value.start).date()
      )

        selectedEventByRef.value.end = dayjs(selectedEventByRef.value.start).add(duration || 60, 'minute').format('YYYY-MM-DD HH:mm:ss')

      else
        selectedEventByRef.value.end = dayjs(selectedEventByRef.value.start).add(1, 'day').set('hour', 0).set('minute', 0).format('YYYY-MM-DD HH:mm:ss')
    }
  }
})

watch(pressed, (value) => {
  if (value && selectedEventByRef.value) {
    selectedEvent.value = toValue(selectedEventByRef)
    const duration = dayjs(dayjs(selectedEventByRef.value.end)).diff((dayjs(selectedEventByRef.value.start)), 'minute')
    selectedEvent.value && (selectedEvent.value.duration = duration)
  }
  else {
    selectedEventByRef.value && (selectedEventByRef.value.inMove = false)
    selectedEventByRef.value && (selectedEventByRef.value.inResize = false)
    selectedEventRef.value?.classList?.remove('in--resize')
    selectedEventRef.value?.classList?.remove('in--move')
    containerProps.ref?.value?.classList?.remove('event--move')
    containerProps.ref?.value?.classList?.remove('event--resize')
    dragHandlerEventResizeRef.value = null
    dragHandlerEventMoveRef.value = null
  }
})

watch(isOutside, (value) => {
  if (value) {
    selectedEventByRef.value && (selectedEventByRef.value.inMove = false)
    selectedEventByRef.value && (selectedEventByRef.value.inResize = false)
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

function scrollToMonth(month: number) {
  const itemsInView = breakpoints['2xl'].value ? 4 : (breakpoints.xl.value ? 3 : (breakpoints.lg.value ? 2 : 1))
  const containerWidth = (widthMonthListRef.value - 120)
  const monthWidth = containerWidth / itemsInView
  const x = (monthWidth * (month)) - (containerWidth / itemsInView)
  xMonthListRef.value = x < 0 ? 0 : (x > monthWidth * 12 ? monthWidth * 12 : x)
}

watchThrottled(
  () => list.value?.at(Math.round(list.value.length / 2))?.data?.date.month(),
  (month) => {
    if (month === undefined || !widthMonthListRef.value)
      return
    scrollToMonth(month + 1)
  },
  { throttle: 500, immediate: true },
)

function scrollToEvent(day: number, month: number, year = dayjs(selectedDate.value).year()) {
  selectedDate.value = dayjs().set('year', year).set('date', day).set('month', month).format('YYYY-MM-DD')
  if (events.value.some(ev => dayjs(new Date(dayjs(selectedDate.value).year(), month, day)).isBetween(dayjs(ev.start), dayjs(ev.end), 'date', '[]')))
    yContainerRef.value = +(dayjs(events.value.find(ev => dayjs(new Date(dayjs(selectedDate.value).year(), month, day)).isBetween(dayjs(ev.start), dayjs(ev.end), 'date', '[]')).start).hour() * 90)
}
function addNewEvent(date: Dayjs) {
  const newEvent = {
    id: `newEvent-${Math.random().toString(36).substring(2, 9)}`,
    title: 'New event',
    description: '',
    location: '',
    organizer: {
      email: '',
    },
    start: date.format('YYYY-MM-DD HH:mm:ss'),
    end: date.add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
    color: '#ee3333',
    isDraggable: true,
    isResizable: true,
  }
  emit('addNewEvent', newEvent)
}
onMounted(async () => {
  updateTimeIndicator()
  await nextTick()
  yContainerRef.value = +(dayjs().hour() * 90)
  await nextTick()
  scrollTo(dayjs(selectedDate.value).dayOfYear() - 1)
})
</script>

<template>
  <div class="relative z-2 h-screen flex flex-1 flex-col snap-y snap-mandatory overflow-x-hidden">
    <!-- grid months -->
    <div v-if="false" id="grid-months" class="relative h-[calc(100%-4rem)] flex flex flex-none flex-col snap-start overflow-hidden bg-white/87 backdrop-blur dark:bg-black/87">
      <div class="h-full overflow-hidden border-b-1px border-gray-4/15">
        <CalendarMonth v-model="selectedDate" :events="events" @event-clicked="(eventData) => (scrollToEvent(dayjs(eventData.start).date(), dayjs(eventData.start).month()), routeHash = '#grid-events')" />
      </div>
    </div>
    <!-- month list -->
    <div
      ref="monthListRef"
      class="z-9 min-h-16 w-full flex flex-nowrap select-none snap-start items-center overflow-auto overflow-y-hidden bg-white/75 text-center shadow-[inset_0_-2px_6px_rgba(0,0,0,0.05)] backdrop-blur space-x-0 dark:bg-black/75"
    >
      <div
        class="sticky left-0 z-22 h-full min-w-30 border-r-1px border-zinc-3/20 bg-slate-2/30 px-1 backdrop-blur dark:border-zinc-6/20 dark:bg-slate-8/30"
      >
        <a-date-picker v-model="selectedDate" value-format="YYYY-MM-DD" format="YYYY-MM-DD">
          <h3 role="button" class="grid mx-auto h-full items-center text-sm/12 font-semibold capitalize">
            {{ dayjs(selectedDate).format('DD/MM/YYYY') }}
          </h3>
        </a-date-picker>
      </div>
      <div class="h-full w-full flex flex-none flex-row flex-nowrap px-0">
        <div
          v-for="month in Array.from({ length: 12 }, (_, i) => i)" :key="month" role="button"
          class="group min-w-95 flex-none basis-[calc((calc(100%-7.5rem)/1))] px-0 transition-all-200 2xl:basis-[calc((calc(100%-7.5rem)/4))] lg:basis-[calc((calc(100%-7.5rem)/2))] xl:basis-[calc((calc(100%-7.5rem)/3))] hover:bg-blue-5/15 first:pl-2 last:pr-2"
          :class="{
            'bg-blue-4/15 month--active': dayjs().set('month', month).isSame(dayjs(selectedDate), 'month'),
          }"
        >
          <div class="h-full w-full">
            <div class="relative h-full w-full">
              <div
                class="pt-2.5"
                @click="() => (selectedDate = dayjs(selectedDate).set('date', 1).set('month', month).format('YYYY-MM-DD'), routeHash = '#grid-months')"
              >
                <a-badge
                  class=""
                  :count="events.filter(ev => dayjs(selectedDate).set('date', 1).set('month', month).isBetween(dayjs(ev.start), dayjs(ev.end), 'month', '[]')).length"
                >
                  <span
                    class="inline from-blue-5 to-sky-6 bg-gradient-to-r bg-clip-text text-7/5 text-transparent font-black tracking-0.6 capitalize opacity-40 transition-all !group-[.month--active]:opacity-90 dark:group-hover:opacity-80"
                  >
                    {{ dayjs().set('month', month).format('MMMM') }}
                  </span>
                </a-badge>
              </div>
              <div
                class="absolute top-[calc(50%+3px)] z-5 h-10px w-full flex justify-between before:pointer-events-none before:absolute before:top-2px before:h-6px before:w-full before:bg-gray-4/20 before:content-[''] group-first:before:rounded-l-3px group-last:before:rounded-r-3px"
              >
                <template v-for="day in dayjs(new Date(dayjs(selectedDate).year(), month + 1, 0)).date()" :key="day">
                  <span
                    role="button"
                    class="group/slider tooltip relative z-6 h-100% w-full flex cursor-pointer items-center justify-center"
                    @click="scrollToEvent(day, month, dayjs(selectedDate).year())"
                  >
                    <span
                      class="relative block h-6px w-6px rounded-0 rounded-full before:(absolute right-2px top-2px h-2px w-2px rounded-full bg-black/15 dark:bg-white/15) !m-auto group-hover/slider:bg-blue-5 before-content-['']"
                      :class="{
                        '!bg-blue-5 scale-120': dayjs(new Date(dayjs(selectedDate).year(), month, day)).isSame(dayjs(selectedDate), 'date'),
                        'bg-green-5': dayjs(new Date(dayjs(selectedDate).year(), month, day)).isSame(dayjs(), 'date'),
                        'bg-dark-1/45 dark:bg-light-1/45': events.some(ev => dayjs(new Date(dayjs(selectedDate).year(), month, day)).isBetween(dayjs(ev.start), dayjs(ev.end), 'date', '[]')),
                      }"
                    />
                    <span class="tooltip-content">
                      <span class="tooltip-text">
                        <span class="tooltip-inner">
                          {{ dayjs().set('year', dayjs(selectedDate).year()).set('month', month).set('date', day).format('DD') }}
                        </span>
                      </span>
                    </span>
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- grid events  -->
    <div id="grid-events" class="relative h-[calc(100%-4rem)] flex flex-auto snap-start border-t-1px border-gray-4/25 bg-light-1/90 dark:bg-dark-9/90">
      <div
        class="content-stretch relative ml-0 mt-auto h-full min-h-92 flex flex-auto flex-nowrap items-stretch overflow-auto"
      >
        <div v-bind="containerProps" class="calendar--container z-8 h-full snap-none">
          <div
            v-bind="wrapperProps" id="days-per-year"
            class="relative min-h-0 min-w-0 before-z-4 !h-auto"
          >
            <!-- sticky left time indicator -->
            <div class="sticky left-0 z-99 h-full flex-none select-none">
              <div class="time-fixed-side relative left-0 z-10 mt-8 min-w-45px w-45px flex flex-col text-3">
                <span
                  class="absolute left-0 top--8 z-9 h-8.25 w-11.25 border-b-1px border-r-1px border-zinc-2/30 bg-slate-2/30 backdrop-blur-sm dark:border-zinc-6/30 dark:bg-slate-8/30"
                />
                <div
                  v-for="time in Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}`)" :key="time"
                  class="min-h-90px border-r-1px border-zinc-3/30 bg-slate-2/30 text-center backdrop-blur-sm dark:border-zinc-6/30 dark:bg-slate-8/30"
                >
                  <span
                    class="sticky top-8.5 mt--2.5 block bg-white p-1 text-2.6/3 dark:bg-dark"
                    :class="{ hidden: time === '00' }"
                  >
                    {{ time }} {{ +time < 12 ? 'AM' : 'PM' }} </span>
                </div>
              </div>
            </div>
            <div
              v-for="item in list" :id="`${item.index + 1}`" :key="item.index" class="day relative flex-none !w-280px"
              :class="{
                'bg-blue-5/5': dayjs().isSame(item.data.date, 'date'),
              }"
            >
              <!-- time-indicator -->
              <span
                v-if="dayjs().isSame(item.data.date, 'date')"
                class="time-indicator pointer-events-none absolute z-70 block h-1px w-full bg-red/65"
                :style="{ top: `${timeIndicatorTop}px` }"
              />
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
                  <div class="relative mx-auto w-full bg-blue-5/2 px-0 text-center">
                    <div
                      v-for="time in Array.from({ length: 24 }, (_, i) => i)" :key="time"
                      class="relative h-90px flex flex-col p-0"
                    >
                      <div
                        :data-date="item.data.date.format('YYYY-MM-DD')"
                        :data-col_time="item.data.date.set('hour', time).set('minute', 0).set('second', 0).format('HH:mm:ss')"
                        class="h-1/2 border-b-1px border-blue-6/20 border-dashed"
                      >
                        <span role="button" class="group button-add h-full w-full flex cursor-pointer items-center justify-center" @click="addNewEvent(item.data.date.set('hour', time).set('minute', 0).set('second', 0))">
                          <span class="i-carbon-add-large opacity-0 transition-all group-hover:opacity-100" />
                        </span>
                      </div>
                      <div
                        :data-date="item.data.date.format('YYYY-MM-DD')"
                        :data-col_time="item.data.date.set('hour', time).set('minute', 30).set('second', 0).format('HH:mm:ss')"
                        class="h-1/2 border-b-1px border-blue-6/40" :class="{ '!border-b-0': time === 23 }"
                      >
                        <span role="button" class="button-add group h-full w-full flex cursor-pointer items-center justify-center" @click="addNewEvent(item.data.date.set('hour', time).set('minute', 30).set('second', 0))">
                          <span class="i-carbon-add-large opacity-0 transition-all group-hover:opacity-100" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- events -->
                  <div class="events-card contents">
                    <Event
                      v-for="(event, index) in item.data.events"
                      :key="event.id"
                      :data-event_id="event.id"
                      :data-date="item.data.date"
                      :style="{
                        top: `${event.top}px`,
                        height: `${event.height}px`,
                        backgroundColor: event.color,
                        zIndex: selectedEvent?.id === event.id ? index + 2 : index,
                      }"
                      :class="[
                        dayjs(event.start).day() === item.data.date.day() && 'rounded-tr-2px',
                        event.inMove && 'in--move',
                        event.inResize && 'in--resize',
                      ]"
                      class="event"
                      :event="event"
                      show-duration
                      :is-draggable="event.isDraggable"
                      :is-resizable="event.isResizable"
                      :date="item.data.date"
                      @mouse-down-handler-event-move="(e) => dragHandlerEventMoveRef = e.target"
                      @mouse-down-handler-event-resize="(e) => dragHandlerEventResizeRef = e.target"
                      @view-more-handler="(event) => modelValue = event"
                    >
                      <template #content>
                        <div class="h-full flex flex-col justify-between pb-1">
                          <p v-html="event.description || event.location || event.organizer?.email || event.title" />
                        </div>
                      </template>
                    </Event>
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
  .time-indicator {
    @apply before-content-[''] before-absolute before-left-0 before-rounded-full before-top--3px before-h-7px before-w-7px before-bg-red;
  }
  .events-card {
    @apply absolute top-0 w-full h-full;

    .event {
      @apply absolute group left-0 min-h-8 w-full flex-1 text-white;
      &.in--move, &.in--resize {
        @apply opacity-75 origin-top-right scale-100 z-45;
        div > * {
          @apply !select-none;
        }
      }

      .event-dragger {}
    }
  }

  &.event--move {
    @apply cursor-grabbing;

    .button-add {
      @apply !pointer-events-none;
    }

    .event {
      @apply !pointer-events-none cursor-grabbing transition-all-0;

      .event-dragger {
        @apply !pointer-events-none;
      }
    }

    .events-card {
      @apply absolue top-0 w-full h-full;
      @apply !pointer-events-none;
    }
  }
}

.arco-calendar.custom-calendar {
  @apply flex flex-col !border-0 h-full;
  --color-neutral-3: rgba(135, 135, 135, 0.10);

  .arco-calendar-header {
    @apply flex-0 p4 border-b-1px border-gray-5/15;
  }

  .arco-calendar-body {
    @apply h-full p0 overflow-auto;

    .arco-calendar-month {
      @apply flex flex-col h-full;

      .arco-calendar-month-cell-body {
        @apply flex flex-col h-full;

        .arco-calendar-month-row {
          @apply h-1/6;
        }
      }
    }

    .arco-calendar-year {
      @apply flex flex-col h-full;

      .arco-calendar-year-row {
        @apply h-1/3 min-h-65;
      }

    }
  }
}

.tooltip {
    @apply relative overflow-visible;

    >.tooltip-content {
        @apply after-content-[''] bg-transparent pointer-events-none absolute z-99 min-w-7 w-auto text-white opacity-0 cursor-default transition-opacity duration-200 delay-0.2s mr-0 mt-0 mb-0.5 bottom-full after:h-0 after:w-0 after:absolute after:pointer-events-none after:ml--5px after:border-t-white after:border-solid after:border-transparent after:border-5px after:left-1/2 after:-bottom-10px;

        span {
            @apply block;
        }

        .tooltip-text {
            @apply overflow-hidden border-b-2px border-white;
            transform: scale3d(0, 1, 1);
            transition: transform 0.2s 0.2s;

            .tooltip-inner {
                @apply max-w-inherit text-center text-sm transition-transform duration-200 p-x0.5 rounded-none bg-black/90;
                transform: translate3d(0, 100%, 0);

                img {
                    opacity: .65;
                }
            }
        }
    }

    &:hover {
        .tooltip-content {
            @apply opacity-100 z-99 delay-0;

            .tooltip-text {
                @apply delay-0;
                transform: scale3d(1, 1, 1);

                .tooltip-inner {
                    @apply transition-delay-0.2s;
                    transform: translate3d(0, 0, 0);
                }
            }
        }
    }
}
</style>
