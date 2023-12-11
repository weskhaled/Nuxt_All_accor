<script setup lang="ts">
import { breakpointsTailwind, useVirtualList } from '@vueuse/core'
import Event from './Event.vue'

interface Props {
  events?: Array<any>
}

const props = withDefaults(defineProps<Props>(), {
  events: () => [],
})

defineEmits(['eventChanged'])
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
      const { date, col_time } = element.value?.dataset
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

watchThrottled(
  () => list.value?.at(Math.round(list.value.length / 2))?.data?.date.month(),
  (month) => {
    if (month === undefined || !widthMonthListRef.value)
      return

    const itemsInView = breakpoints['2xl'].value ? 4 : (breakpoints.xl.value ? 3 : (breakpoints.lg.value ? 2 : 1))
    const containerWidth = (widthMonthListRef.value - 180)
    const monthWidth = containerWidth / itemsInView
    const x = (monthWidth * month) - (containerWidth / itemsInView)
    xMonthListRef.value = x < 0 ? 0 : (x > monthWidth * 12 ? monthWidth * 12 : x)
  },
  { throttle: 500 },
)

function scrollToEvent(day: number, month: number, year = dayjs(selectedDate.value).year()) {
  selectedDate.value = dayjs().set('year', year).set('date', day).set('month', month).format('YYYY-MM-DD')
  if (props.events.some(ev => dayjs(new Date(dayjs(selectedDate.value).year(), month, day)).isBetween(dayjs(ev.start), dayjs(ev.end), 'date', '[]')))
    yContainerRef.value = +(dayjs(props.events.find(ev => dayjs(new Date(dayjs(selectedDate.value).year(), month, day)).isBetween(dayjs(ev.start), dayjs(ev.end), 'date', '[]')).start).hour() * 90)
}

onMounted(async () => {
  updateTimeIndicator()
  await nextTick()
  scrollTo(dayjs(selectedDate.value).dayOfYear() - 1)
})
</script>

<template>
  <div class="z-2 h-full flex flex-1 flex-col snap-y snap-mandatory overflow-x-hidden">
    <div class="flex flex flex-none flex-col snap-start overflow-hidden bg-white/90 backdrop-blur dark:bg-black/90">
      <div class="h-[calc(100vh-7.5rem)] overflow-hidden border-b-1px border-gray-4/15 md:h-[calc(100vh-6.5rem)]">
        <!-- <a-calendar v-model="selectedDate" value-format="YYYY-MM-DD" format="YYYY-MM-DD" class="custom-calendar" /> -->
        <CalendarMonth v-model="selectedDate" :events="events" @event-clicked="(eventData) => scrollToEvent(dayjs(eventData.start).date(), dayjs(eventData.start).month())" />
      </div>
      <div
        ref="monthListRef"
        class="z-9 h-16 w-full flex flex-nowrap select-none items-center overflow-auto overflow-y-hidden text-center space-x-0"
      >
        <div
          class="sticky left-0 z-22 h-full min-w-45 border-r-1px border-zinc-3/20 bg-slate-2/30 px-1 backdrop-blur dark:border-zinc-6/20 dark:bg-slate-8/30"
        >
          <a-date-picker v-model="selectedDate" value-format="YYYY-MM-DD" format="YYYY-MM-DD">
            <h3 role="button" class="grid mx-auto h-full items-center px-2 text-sm/12 font-semibold capitalize">
              {{ dayjs(selectedDate).format('DD MMMM, YYYY') }}
            </h3>
          </a-date-picker>
        </div>
        <div class="h-full w-full flex flex-none flex-row flex-nowrap px-0">
          <div
            v-for="month in Array.from({ length: 12 }, (_, i) => i)" :key="month" role="button"
            class="group min-w-95 flex-none basis-[calc((calc(100%-11.25rem)/1))] px-0 transition-all-200 2xl:basis-[calc((calc(100%-11.25rem)/4))] lg:basis-[calc((calc(100%-11.25rem)/2))] xl:basis-[calc((calc(100%-11.25rem)/3))] hover:bg-blue-5/15 first:pl-2 last:pr-2"
            :class="{
              'bg-blue-4/15 month--active': dayjs().set('month', month).isSame(dayjs(selectedDate), 'month'),
            }"
          >
            <div class="h-full w-full">
              <div class="relative h-full w-full">
                <div
                  class="pt-2.5"
                  @click="() => selectedDate = dayjs(selectedDate).set('date', 1).set('month', month).format('YYYY-MM-DD')"
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
                  class="absolute bottom-3 z-5 w-full flex justify-between before:pointer-events-none before:absolute before:top-7px before:h-3px before:w-full before:bg-gray-4/20 before:content-[''] group-first:before:rounded-l-2px group-last:before:rounded-r-2px"
                >
                  <template v-for="day in dayjs(new Date(dayjs(selectedDate).year(), month + 1, 0)).date()" :key="day">
                    <a-tooltip
                      :content="`${dayjs(new Date(dayjs(selectedDate).year(), month, day)).format('DD')}`"
                      position="top" mini
                    >
                      <span
                        role="button"
                        class="group/slider relative z-6 h-16px w-full flex cursor-pointer items-center justify-center"
                        @click="scrollToEvent(day, month, dayjs(selectedDate).year())"
                      >
                        <span
                          class="block h-7px w-7px rounded-0 rounded-full !m-auto group-hover/slider:bg-blue-5"
                          :class="{
                            '!bg-blue-5': dayjs(new Date(dayjs(selectedDate).year(), month, day)).isSame(dayjs(selectedDate), 'date'),
                            'bg-green-5': dayjs(new Date(dayjs(selectedDate).year(), month, day)).isSame(dayjs(), 'date'),
                            'bg-gray-4/25': events.some(ev => dayjs(new Date(dayjs(selectedDate).year(), month, day)).isBetween(dayjs(ev.start), dayjs(ev.end), 'date', '[]')),
                          }"
                        />
                      </span>
                    </a-tooltip>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="relative flex flex-auto snap-start border-t-1px border-gray-4/25 bg-light-1 dark:bg-dark-9">
      <div
        class="content-stretch relative ml-0 h-[calc(100vh-4rem)] min-h-92 flex flex-auto flex-nowrap items-stretch overflow-auto overflow-auto md:h-[calc(100vh-6.65rem)]"
      >
        <div v-bind="containerProps" class="calendar--container z-8 h-full snap-none">
          <div
            v-bind="wrapperProps" id="days-per-year"
            class="relative min-h-0 min-w-0 before-z-4 !h-auto"
          >
            <!-- time-indicator -->
            <span
              class="time-indicator pointer-events-none absolute z-70 block h-1px w-full bg-green/45"
              :style="{ top: `${timeIndicatorTop}px` }"
            />
            <!-- sticky left indicator -->
            <div class="sticky left-0 z-99 h-full select-none">
              <div class="time-fixed-side relative left-0 z-10 mt-8 min-w-45px w-45px flex flex-col text-3">
                <span
                  class="absolute left-0 top--8 z-9 h-8.25 w-11 border-b-1px border-r-1px border-zinc-2/30 bg-slate-2/30 backdrop-blur dark:border-zinc-6/30 dark:bg-slate-8/30"
                />
                <div
                  v-for="time in Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}`)" :key="time"
                  class="min-h-90px border-r-1px border-zinc-3/30 bg-slate-2/30 text-center backdrop-blur dark:border-zinc-6/30 dark:bg-slate-8/30"
                >
                  <span
                    class="top-8.5 mt--2.5 block bg-white p-1 text-2.6/3 dark:bg-dark"
                    :class="{ hidden: time === '00' }"
                  >
                    {{ time }} {{ +time < 12 ? 'AM' : 'PM' }} </span>
                </div>
              </div>
            </div>
            <div
              v-for="item in list" :id="`${item.index + 1}`" :key="item.index" class="day !w-280px"
              :class="{
                'bg-blue-5/5': dayjs().isSame(item.data.date, 'date'),
              }"
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
                      :date="item.data.date"
                      @mouse-down-handler-event-move="(e) => dragHandlerEventMoveRef = e.target"
                      @mouse-down-handler-event-resize="(e) => dragHandlerEventResizeRef = e.target"
                    >
                      <template #content>
                        <div class="h-full flex flex-col justify-between pb-1">
                          <h4>
                            {{ event.start }}
                          </h4>
                          <a-button
                            size="mini" type="primary" class="mt-1"
                          >
                            Edit
                          </a-button>
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
  .events-card {
    @apply absolute top-0 w-full h-full;

    .event {
      @apply absolute group left-0 min-h-max w-full flex-1 pb-2px text-white;

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
</style>
