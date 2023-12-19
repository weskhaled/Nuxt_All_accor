<script setup>
import { breakpointsTailwind } from '@vueuse/core'

const props = defineProps({
  modelValue: { type: [String, Number, Date] },
  events: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue', 'eventClicked'])
// const breakpoints = useBreakpoints(breakpointsTailwind)
const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const { dayjs } = useDayjs()

const { modelValue } = useVModels(props, emit)
const [valueShowMonths, toggleShowMonths] = useToggle()
const showSelectedMonth = ref(-1)
const daysInWeek = computed(() =>
  Array.from({ length: 7 }, (_, i) => dayjs().isoWeekday(i)),
)

const daysInYear = computed(() => {
  return Array.from({ length: 12 }, (_, monthIndex) => {
    const month = dayjs(modelValue.value).month(monthIndex)
    return {
      month,
      days: Array.from({ length: 42 }, (_, dayIndex) => {
        const startDay = month.startOf('month')
        const daysInPrevMonth = startDay.day()
        const date = startDay.add(dayIndex, 'day').subtract(daysInPrevMonth, 'day')
        const isCurrentMonth = date.month() === dayjs().month()
        const inSameMonth = date.isSame(month, 'month')
        const isToday = date.isSame(dayjs(), 'day')
        const isSelected = date.isSame(modelValue.value, 'day')

        return {
          date,
          isCurrentMonth,
          inSameMonth,
          isToday,
          isSelected,
          events: props.events.filter(event => date.isBetween(dayjs(event.start), dayjs(event.end).subtract(1, 'minute'), 'date', '[]')),
        }
      }),
    }
  })
})
watch(modelValue, (value) => {
  showSelectedMonth.value > -1 && (showSelectedMonth.value = dayjs(value).month())
})
const selectedMonth = computed(() => {
  return daysInYear.value.find(month => month.month.isSame(modelValue.value, 'month'))
})
</script>

<template>
  <div class="h-full flex flex-col before:([background-image:var(--un-gradient)] pointer-events-none absolute h-full w-full bg-gradient-[radial-gradient(circle,_rgba(45,_0,_255,_0.3)_0%,_rgba(144,_172,_255,_0)_70%,_rgba(144,_172,_255,_0)_100%)] opacity-15) before-content-['']">
    <div v-if="true" class="h-full flex flex-1">
      <div
        class="relative h-auto w-full snap-y snap-mandatory overflow-y-auto [&>div:nth-child(4n)]:border-r-0 [&>div:nth-child(n+9)]:border-b-0"
        :class="[showSelectedMonth > -1 ? '[&>div]:border-0 [&>div]:p-0 snap-y snap-mandatory' : 'lg:grid lg:grid-cols-4 lg:grid-rows-3']"
      >
        <div
          v-for="month in daysInYear" :key="month.month.format('MM')"
          class="relative flex flex-col snap-start overflow-auto border-b border-r border-gray-5/20 lg:h-full dark:border-gray-8"
          :class="[
            showSelectedMonth === month.month.month() ? 'w-full h-full' : (showSelectedMonth > -1 && '!hidden'),
          ]"
        >
          <div class="month-header flex-none bg-light/35 dark:bg-dark/35">
            <h4
              class="mb-1 text-center font-bold tracking-wide capitalize"
              :class="[
                showSelectedMonth === month.month.month() ? 'text-6.5/9' : 'text-4.6/8',
              ]"
              @click="showSelectedMonth === -1 ? (showSelectedMonth = month.month.month()) : showSelectedMonth = -1"
            >
              {{ month.month.format('MMMM') }}
            </h4>
          </div>
          <div class="flex flex-1 flex-col p0">
            <div class="flex border-b border-gray-5/10 text-center text-dark-9/70 font-semibold dark:border-gray-8/30 dark:text-blue-1/80">
              <template
                v-for="day in daysInWeek" :key="day.format('DD-MM-YYYY')"
              >
                <div
                  class="w-1/7 truncate border-r border-gray-5/10 py1 capitalize last:border-0 dark:border-gray-8/30"
                  :class="[
                    showSelectedMonth === month.month.month() ? 'bg-light/45 dark:bg-dark/45' : 'bg-light/25 dark:bg-dark/25',
                  ]"
                >
                  {{ day.format(showSelectedMonth === month.month.month() ? 'dddd' : 'ddd') }}
                </div>
              </template>
            </div>
            <div class="isolate grid grid-cols-7 grid-rows-6 h-full w-full gap-0px text-center font-mono [&>div:nth-child(7n)]:border-r-0 [&>div:nth-child(n+36)]:border-b-0">
              <template v-for="(day, index) in month.days" :key="index">
                <div
                  class="min-h-full min-w-7 w-full flex items-center justify-center overflow-hidden border-b border-r border-gray-5/10 dark:border-gray-8/30"
                >
                  <div class="h-full w-full flex items-center justify-center">
                    <span
                      :role="day.inSameMonth && 'button'"
                      class="h-6 w-6 flex items-center justify-center border-sky-4 rounded-full transition-all"
                      :class="[day.inSameMonth ? 'opacity-100 hover:bg-sky/60' : 'opacity-20 select-none', day.inSameMonth && (((day.isSelected || day.isToday) && 'font-semibold') && (day.isToday && 'border border-sky/90' || day.isSelected && 'bg-sky/90'))]"
                      @click="day.inSameMonth && (modelValue = day.date.format('YYYY-MM-DD'))"
                    >
                      {{ day.date.format('DD') }}
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="min-h-[calc(100%-3.25rem)] overflow-y-auto lg:flex lg:flex-col">
      <div class="ring-zin-1 h-full flex flex-auto flex-col ring-0">
        <div
          class="flex-0 sticky top-0 z-3 flex border-b border-gray-5/20 bg-white/75 text-center text-sm text-gray-7 font-semibold leading-4 backdrop-blur !w-full dark:border-gray-8 dark:bg-black/75 dark:text-light-2"
        >
          <div
            v-for="day in daysInWeek" :key="day.format('DD-MM-YYYY')"
            class="w-1/7 border-r border-gray-5/20 py-3 capitalize last:border-0 dark:border-gray-8"
          >
            {{ day.format('dddd') }}
          </div>
        </div>
        <div class="text-md h-full flex text-dark-2 leading-6 lg:flex-auto dark:text-light-2">
          <div class="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-0px">
            <div
              v-for="day in selectedMonth.days" :key="day.date.format('YYYY-MM-DD')"
              class="relative overflow-auto border-b border-r border-gray-5/20 p2 [&:nth-child(7n)]:border-r-0 [&:nth-child(n+36)]:border-b-0 dark:border-gray-8"
              :class="[
                day.inSameMonth ? 'text-dark dark:text-light' : 'text-dark/30 dark:text-light/30',
              ]"
            >
              <time
                :datetime="day.date.format('YYYY-MM-DD')"
                role="button"
                class="h-6.5 w-6.5 flex items-center justify-center rounded-full text-3.4/3 hover:bg-blue-4 hover:text-light"
                :class="[
                  day.isToday ? 'border-1px border-sky-5 font-semibold' : undefined,
                  day.isSelected ? 'bg-sky-4 font-semibold text-white' : undefined,
                ]"
                @click="modelValue = day.date.format('YYYY-MM-DD')"
              >
                {{ day.date.format('DD') }}
              </time>
              <ol v-if="day.events.length > 0" class="mt-1">
                <li v-for="event in day.events.slice(0, 2)" :key="event.id">
                  <a href="javascript:;" class="group flex cursor-pointer" @click="$emit('eventClicked', event)">
                    <p class="flex-auto truncate text-gray-4 font-medium group-hover:text-sky-4">
                      {{ event.title }}
                    </p>
                    <time
                      :datetime="event.start"
                      class="ml-3 hidden flex-none text-gray-500 xl:block group-hover:text-sky-4"
                    >
                      {{ dayjs(event.start).format('HH:mm') }}</time>
                  </a>
                </li>
                <li v-if="day.events.length > 2" class="text-gray-500">
                  + {{ day.events.length - 2 }}
                  <span class="ml-1">
                    more
                  </span>
                </li>
              </ol>
            </div>
          </div>
          <div class="isolate grid grid-cols-7 grid-rows-6 w-full gap-0px lg:hidden">
            <button
              v-for="day in selectedMonth.days"
              :key="day.date.format('YYYY-MM-DD')" type="button" class="hover:bg-gray-1000 h-auto min-h-18 flex flex-col border-b border-r border-gray-5/20 px-3 py-2 focus:z-10 [&:nth-child(7n)]:border-r-0 [&:nth-child(n+36)]:border-b-0 dark:border-gray-8"
              @click="modelValue = day.date.format('YYYY-MM-DD')"
            >
              <time
                :datetime="day.date"
                class="ml-auto h-6 w-6 flex items-center justify-center rounded-full text-3.4/3 hover:bg-blue-4 hover:text-light"
                :class="[day.isToday && 'border border-sky-5 font-semibold', day.isSelected && day.isToday && 'bg-sky-6 font-semibold', day.isSelected && !day.isToday && 'bg-sky-5 font-semibold']"
              >
                {{ day.date.format('DD') }}
              </time>
              <span class="sr-only">{{ day.events.length }} events</span>
              <span v-if="day.events.length > 0" class="mt-auto flex flex-wrap-reverse -mx-0.5">
                <span
                  v-for="event in day.events" :key="event.id"
                  :style="{ backgroundColor: event.color }"
                  role="button"
                  class="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"
                  @click="$emit('eventClicked', event)"
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
