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

const daysInWeek = computed(() =>
  Array.from({ length: 7 }, (_, i) => dayjs().isoWeekday(i)),
)

const days = computed(() => {
  return Array.from({ length: 42 }, (_, i) => {
    const daysInPrevMonth = dayjs(modelValue.value).startOf('month').day()
    const date = dayjs(modelValue.value).startOf('month').add(i, 'day').subtract(daysInPrevMonth, 'day')
    const isCurrentMonth = date.month() === dayjs(modelValue.value).month()
    const isToday = date.isSame(dayjs(), 'day')
    const isSelected = date.isSame(modelValue.value, 'day')

    return {
      date,
      isCurrentMonth,
      isToday,
      isSelected,
      events: props.events.filter(event => date.isBetween(dayjs(event.start), dayjs(event.end).subtract(1, 'minute'), 'date', '[]')),
    }
  })
})
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="header p-2">
      <h3 class="text-6.5/10 capitalize">
        {{ dayjs(modelValue).format('MMMM, YYYY') }}
      </h3>
    </div>
    <div class="h-full lg:flex lg:flex-col">
      <div class="ring-zin-1 h-full flex flex-auto flex-col ring-0">
        <div
          class="flex-0 flex border-y border-gray-5/15 text-center text-sm text-gray-7 font-semibold leading-4 !w-full dark:text-light-2"
        >
          <div
            v-for="day in daysInWeek" :key="day.format('DD-MM-YYYY')"
            class="w-1/7 border-r border-gray-5/20 bg-white/15 py-3 capitalize last:border-0 dark:bg-black/15"
          >
            {{ day.format('dddd') }}
          </div>
        </div>
        <div class="text-md h-full flex text-dark-2 leading-6 lg:flex-auto dark:text-light-2">
          <div class="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-0px">
            <div
              v-for="day in days" :key="day.date.format('YYYY-MM-DD')"
              class="relative border-b border-r border-gray-2 px-3 py-2 [&:nth-child(7n)]:border-r-0 [&:nth-child(n+36)]:border-b-0 dark:border-gray-8"
              :class="[
                day.isCurrentMonth ? 'text-dark dark:text-light' : 'text-dark/60 dark:text-light/60',
              ]"
            >
              <time
                :datetime="day.date.format('YYYY-MM-DD')"
                role="button"
                class="h-6.5 w-6.5 flex items-center justify-center rounded-full text-3.4/3 hover:bg-blue-4 hover:text-light"
                :class="[
                  day.isToday ? 'bg-sky-4 font-semibold text-white' : undefined,
                  day.isSelected ? 'border-1px border-sky-4 font-semibold' : undefined,
                ]"
                @click="modelValue = day.date.format('YYYY-MM-DD')"
              >
                {{ day.date.format('DD') }}
              </time>
              <ol v-if="day.events.length > 0" class="mt-2">
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
                  + {{ day.events.length - 2 }} more
                </li>
              </ol>
            </div>
          </div>
          <div class="isolate grid grid-cols-7 grid-rows-6 w-full gap-0px lg:hidden">
            <button
              v-for="day in days" :key="day.date.format('YYYY-MM-DD')" type="button"
              class="hover:bg-gray-1000 h-auto min-h-18 flex flex-col border-b border-r px-3 py-2 focus:z-10 [&:nth-child(7n)]:border-r-0 [&:nth-child(n+36)]:border-b-0 dark:border-gray-5/25"
            >
              <time
                :datetime="day.date" class="ml-auto"
                :class="[day.isSelected && 'flex h-6 w-6 items-center justify-center rounded-full', day.isSelected && day.isToday && 'bg-sky-600', day.isSelected && !day.isToday && 'bg-gray-5']"
              >
                {{ day.date.format('DD') }}</time>
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
