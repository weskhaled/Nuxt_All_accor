<script setup lang="ts">
import { promiseTimeout } from '@vueuse/core'
import { v4 as uuid } from 'uuid'

definePageMeta({
  layout: 'main',
  middleware: ['auth'],
})

const { dayjs } = useDayjs()
const events = ref<any>([
  {
    id: uuid(),
    title: 'loerem ipsum dolor sit amet, consectetur adipiscing elit',
    start: '2024-01-02 02:00:00',
    end: '2024-01-03 06:00:00',
    color: '#9d174d',
  },
  {
    id: uuid(),
    title: 'loerem ipsum dolor sit amet, consectetur adipiscing elit',
    start: '2024-01-04 06:30:00',
    end: '2024-01-04 08:00:00',
    color: '#00aaff',
  },
  {
    id: uuid(),
    title: 'loerem ipsum dolor sit amet, consectetur adipiscing elit',
    start: '2024-06-04 14:30:00',
    end: '2024-06-04 17:00:00',
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
])
const selectedEvent = ref<any>(null)
const visibleDrawer = ref<boolean>(false)

const { data, error } = await useFetch('/api/google/calendars/primary/events')
if (!error.value && data?.value?.length)
  events.value = data.value

function eventChanged() {
  // console.log(event)
  // const id = event.id
  // const foundedEvent = mockedEvents.value.events.find((e: any) => e.id === id)

  // if (foundedEvent) {
  //   foundedEvent.start = event.start
  //   foundedEvent.end = event.end
  // }
}
function addNewEvent(newEvent: any) {
  if (!newEvent)
    return

  events.value.push({
    ...newEvent,
    inEditMode: true,
  })
  selectedEvent.value = events.value.find(ev => ev.id === newEvent.id)
  visibleDrawer.value = true
}

async function cancelDrawerHandler() {
  visibleDrawer.value = false

  // delete event
  if (selectedEvent.value && selectedEvent.value.inEditMode) {
    const id = selectedEvent.value.id
    const foundedEvent = events.value.find((e: any) => e.id === id)

    if (foundedEvent)
      events.value.splice(events.value.indexOf(foundedEvent), 1)
  }

  await promiseTimeout(100)
  selectedEvent.value = null
}

async function okDrawerHandler() {
  visibleDrawer.value = false

  await promiseTimeout(100)
  selectedEvent.value = null
}
watch(() => selectedEvent.value, (event) => {
  if (!event)
    return

  visibleDrawer.value = true
})
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden overflow-y-auto">
    <Calendar v-model:events="events" v-model="selectedEvent" @event-changed="eventChanged" @add-new-event="addNewEvent" />
  </div>
  <a-drawer
    placement="right" popup-container="#layoutMain" :footer="false"
    class="!z-99 [&_.arco-drawer-body]:(overflow-hidden p-0) ![&_.arco-drawer]:w-[calc(100%-5rem)] ![&_.arco-drawer-title]:truncate ![&_.arco-drawer-header]:border-b-stone-2 !lg:[&_.arco-drawer]:w-65% !xl:[&_.arco-drawer]:w-45% !dark:[&_.arco-drawer-header]:border-b-stone-9"
    :visible="visibleDrawer"
    unmount-on-close
    @cancel="cancelDrawerHandler"
  >
    <template #title>
      {{ selectedEvent?.title || 'Event details' }}
    </template>
    <div class="h-full flex flex-col justify-between">
      <div class="flex-1 overflow-auto p-2">
        <a-descriptions
          :data="selectedEvent && Object.keys(selectedEvent).map(i => ({
            label: i,
            value: `${selectedEvent[i]}`,
          }))" title="Event Info" layout="inline-vertical" bordered
        />
      </div>
      <div class="flex-none border-t border-stone-2 p-2 text-right space-x-1 dark:border-stone-9">
        <a-button class="custom-shadow !font-semibold" type="primary" status="danger" size="small" @click="visibleDrawer = false">
          Close
        </a-button>
        <a-button type="primary" class="custom-shadow group !pl-0 !font-semibold" size="small" @click="okDrawerHandler">
          <span class="hidden flex-1 lg:flex lg:px-3">
            Save
          </span>
          <span
            class="h-full w-8 flex items-center justify-center rounded-2px bg-dark-9/10 -mr-[calc(1rem-1px)]"
          >
            <span class="h-4 w-4 transition-all" i-carbon-checkmark />
          </span>
        </a-button>
      </div>
    </div>
  </a-drawer>
</template>

<style lang="less">

</style>
