<script setup lang="ts">
import { v4 as uuid } from 'uuid'

definePageMeta({
  layout: 'main',
  middleware: ['auth'],
})
const { dayjs } = useDayjs()
const events = ref<any>([])

const { data, error } = await useFetch(`/api/google/calendars/events`)
if (!error.value && data.value?.items) {
  events.value = data.value?.items?.map((event: any) => ({
    ...event,
    title: event.summary,
    start: dayjs(event.start.dateTime),
    end: dayjs(event.end.dateTime),
    color: '#00aaff',
  }))
}
else {
  events.value = [
    {
      id: uuid(),
      title: 'loerem ipsum dolor sit amet, consectetur adipiscing elit',
      start: '2023-01-02 02:00:00',
      end: '2023-01-03 06:00:00',
      color: '#9d174d',
    },
    {
      id: uuid(),
      title: 'loerem ipsum dolor sit amet, consectetur adipiscing elit',
      start: '2023-01-04 06:30:00',
      end: '2023-01-04 08:00:00',
      color: '#00aaff',
    },
    {
      id: uuid(),
      title: 'loerem ipsum dolor sit amet, consectetur adipiscing elit',
      start: '2023-06-04 14:30:00',
      end: '2023-06-04 17:00:00',
      color: '#00fafa',
    },
    {
      id: uuid(),
      title: 'Event 2',
      start: dayjs().add(1, 'day').hour(3).minute(5).second(0).format('YYYY-MM-DD HH:mm:ss'),
      end: dayjs().add(1, 'day').hour(4).minute(55).second(0).format('YYYY-MM-DD HH:mm:ss'),
      color: '#0f766e',
    },
    {
      id: uuid(),
      title: 'Event 3',
      start: dayjs().add(2, 'day').hour(3).minute(25).second(0).format('YYYY-MM-DD HH:mm:ss'),
      end: dayjs().add(2, 'day').hour(5).minute(5).second(0).format('YYYY-MM-DD HH:mm:ss'),
      color: '#2563eb',
    },
    {
      id: uuid(),
      title: 'Event 4',
      start: dayjs().add(3, 'day').hour(9).minute(15).second(0).format('YYYY-MM-DD HH:mm:ss'),
      end: dayjs().add(3, 'day').hour(13).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'),
      color: '#6d28d9',
    },
  ]
}

// const events = computed(() => mockedEvents.value.events)
function eventChanged(event: any) {
  if (!event)
    return

  console.log(event)
  // const id = event.id
  // const foundedEvent = mockedEvents.value.events.find((e: any) => e.id === id)

  // if (foundedEvent) {
  //   foundedEvent.start = event.start
  //   foundedEvent.end = event.end
  // }
}
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden overflow-y-auto">
    <Calendar :events="events" @event-changed="eventChanged" />
  </div>
</template>

<style lang="less">

</style>
