<script setup lang="ts">
import { promiseTimeout } from '@vueuse/core'
import { UseImage } from '@vueuse/components'

interface Props {
  modelValue?: any
  hotelDetails?: any
  selectedHotelId?: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => false,
  hotelDetails: () => null,
})

const emit = defineEmits(['back', 'update:modelValue', 'showHotelImagesViewer', 'update:selectedHotelId'])

const { modelValue, hotelDetails, selectedHotelId } = useVModels(props, emit)
// const isMounted = useMounted()
const isDark = computed(() => useColorMode().value === 'dark')
const { dayjs } = useDayjs()
const hotelStars = computed(() => modelValue && hotelDetails ? (+toValue(hotelDetails)?.hotel?.rating?.star?.score || 0) : 0)
const loadingGetRooms = ref(true)
const errorGetRooms: any = ref(null)
const rooms: any = ref([])
const selectedTariff: any = ref(null)
const selectedTariffChanged = ref(false)

useAsyncData(
  async () => {
    if (!hotelDetails.value || !hotelDetails.value.offers?.length || !modelValue.value)
      return

    selectedTariff.value = null
    loadingGetRooms.value = true
    errorGetRooms.value = null
    rooms.value = []
    const hotelId = hotelDetails.value.hotel?.id
    const dateIn = hotelDetails.value.offers[0].period?.dateIn
    const nights = hotelDetails.value.offers[0].period?.nights
    const adults = hotelDetails.value.offers[0].effectiveOccupancy?.adults
    const childrenAges = hotelDetails.value.offers[0].effectiveOccupancy?.childrenAge
    return await useFetch(`/api/hotels/${hotelId}/rooms?adults=${adults}&dateIn=${dateIn}&nights=${nights}&childrenAges=${childrenAges}`).then(({ data, error }) => {
      if (data.value) {
        rooms.value = data.value?.data
        selectedTariff.value = `${rooms.value[0]?.code}_${rooms.value[0]?.offers[0]?.code}`
      }

      else if (error.value) { errorGetRooms.value = error.value }

      loadingGetRooms.value = false
    })
  },
  {
    watch: [() => hotelDetails.value, () => modelValue.value],
  },
)

const hotelSliders = computed(() => {
  if (!hotelDetails.value?.hotel?.media?.medias)
    return []

  return hotelDetails.value?.hotel?.media?.medias.map(m => ({
    title: 'Intro',
    image: {
      screen: m['1024x768'] || m['2048x1536'],
      thumb: m['346x260'] || m['120x90'],
    },
  })) || []
})

const selectedRoomOffer = computed(() => {
  if (!selectedTariff.value)
    return null

  const parsedValue = selectedTariff.value.split('_')
  const roomId = parsedValue[0]
  const offreId = parsedValue[1]
  if (roomId && offreId) {
    return {
      roomCode: rooms.value.find(r => r.code === roomId)?.code,
      offer: rooms.value.find(r => r.code === roomId)?.offers?.find(o => o.code === offreId),
    }
  }
})

watchDebounced(
  selectedTariff,
  async () => {
    selectedTariffChanged.value = true
    await promiseTimeout(501)
    selectedTariffChanged.value = false
  },
  { debounce: 0, maxWait: 501 },
)
</script>

<template>
  <client-only>
    <!-- loading state via #fallback slot -->
    <div v-if="hotelDetails && modelValue" class="relative h-auto w-full flex flex-col pb-18 delay-200 md:pb-0" :class="[!modelValue ? '!hidden !invisible delay-200' : '!visible delay-200']">
      <div class="header-hotel-details sticky top-0 z-11 w-full flex flex-none items-center justify-between border-b-1px bg-light-1/85 p-2 shadow-bluegray/0 shadow-none backdrop-blur backdrop-filter dark:border-dark-9 dark:bg-dark-9/85">
        <a-button
          shape="circle" size="small"
          class="m-0 inline-block flex-none !h-6 !w-6 !border-1px !border-blue"
          type="text"
          aria-label="Previous"
          @click="() => (modelValue = null, selectedHotelId = null)"
        >
          <template #icon>
            <span i-carbon-arrow-left class="" />
          </template>
        </a-button>
        <h3 class="text-md my-1 flex-1 text-center font-semibold font-chillax md:text-2xl">
          Choisissez votre chambre
        </h3>
      </div>
      <div class="text-gray-9 dark:text-gray-2">
        <div class="mx-auto max-w-3xl px-3 py-3 lg:max-w-7xl">
          <div class="top-20 flex !hidden">
            <h1 class="my-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {{ hotelDetails?.hotel?.name }}
            </h1>
          </div>
          <!-- card hotel -->
          <div class="[--animate-duration:0.5s] m-0 mb-2 w-full flex-none lg:sticky lg:top-17.25 lg:float-right lg:mb-0 lg:max-w-sm lg:w-xs xl:w-sm">
            <div class="w-full overflow-hidden border border-gray-200 rounded-sm bg-white/75 shadow-sm dark:border-gray-700 dark:bg-gray-8/75">
              <div class="relative">
                <a-carousel
                  :style="{
                    width: '100%',
                    height: '220px',
                  }"
                  class="border-b-1px border-zinc-3 bg-slate-3 dark:border-zinc-8 dark:bg-dark-9 ![&_.arco-carousel-arrow>div]:bg-black/60"
                  :auto-play="{ interval: 15000, hoverToPause: true }" indicator-type="dot"
                  show-arrow="hover" animation-name="fade"
                >
                  <a-carousel-item v-for="(image, index) in hotelSliders" :key="index">
                    <div
                      class="h-full w-full flex items-center justify-center"
                      @click="$emit('showHotelImagesViewer', hotelDetails?.hotelCode)"
                    >
                      <UseImage
                        class="h-auto w-full"
                        :src="image.image.screen"
                      >
                        <template #loading>
                          <a-spin />
                        </template>

                        <template #error>
                          <span class="flex items-center overflow-hidden truncate text-gray-4">
                            <h4>Image Not found</h4>
                          </span>
                        </template>
                      </UseImage>
                    </div>
                  </a-carousel-item>
                </a-carousel>
                <div
                  v-if="hotelDetails?.hotel?.media?.count"
                  class="absolute bottom-1 left-1 z-2 flex items-center rounded-1 bg-light-1/75 p-2 dark:bg-black/75"
                >
                  <span class="i-carbon-image-copy mr-1 inline-block h-4 w-4 text-sm" />
                  {{ hotelDetails.hotel.media?.count }}
                </div>
                <div class="absolute right-1 top-auto z-2 flex items-center rounded-1 bg-light-1/75 p-1 lt-sm:bottom-1 md:top-1">
                  <UseImage
                    class="h-8 w-8 fill-current text-dark-6"
                    :src="`/img/hotels-brands/${hotelDetails.hotel.brand}.svg`"
                  >
                    <template #loading>
                      Loading..
                    </template>

                    <template #error>
                      <span class="h-8 w-8 flex items-center overflow-hidden truncate text-dark-6">
                        {{ hotelDetails.hotel?.brand }}
                      </span>
                    </template>
                  </UseImage>
                </div>
              </div>
              <div class="px-3 pb-5">
                <div>
                  <h1 class="m-0 my-1 mt-2 text-xl font-bold tracking-tight font-mono sm:text-2xl">
                    {{ hotelDetails?.hotel?.name }}
                  </h1>
                  <h5 class="my-1 text-xl text-gray-900 font-semibold tracking-tight dark:text-white">
                    Hôtel
                    <a-rate
                      v-model="hotelStars"
                      class="mx-1 mt-3 h-4 min-w-20 !min-h-21px [&_.arco-icon]:h-1.2rem [&_.arco-icon]:w-1.2rem ![&_.arco-rate-character:not(:last-child)]:mr-2px" allow-half readonly
                    >
                      <template #character>
                        <span class="i-carbon-star-filled block h-4 w-4 text-sm" />
                      </template>
                    </a-rate>
                  </h5>
                  <p :title="hotelDetails?.hotel?.description" class="mb-2 overflow-hidden truncate text-gray-700 font-normal dark:text-gray-400">
                    {{ hotelDetails?.hotel?.description }}
                  </p>
                  <div class="flex border-t-1px border-bluegray-5/25 py-2 space-x-1">
                    <img class="h-5 w-5" :src="`https://api.iconify.design/mingcute:fitness-line.svg?color=%23${isDark ? 'fff' : '000'}`" alt="">
                    <img class="h-5 w-5" :src="`https://api.iconify.design/ph:swimming-pool-light.svg?color=%23${isDark ? 'fff' : '000'}`" alt="">
                    <img class="h-5 w-5" :src="`https://api.iconify.design/ic:twotone-local-parking.svg?color=%23${isDark ? 'fff' : '000'}`" alt="">
                    <img class="h-5 w-5" :src="`https://api.iconify.design/guidance:stroller-parking.svg?color=%23${isDark ? 'fff' : '000'}`" alt="">
                  </div>
                  <div class="mb-2 border-t-1px border-bluegray-5/25 py-3">
                    <div class="flex pb-1">
                      <span class="i-carbon-calendar mr-1 inline-block h-4.2 w-4.2 text-sm" />
                      <div class="flex items-center text-4">
                        <span>
                          {{ dayjs(hotelDetails.offers[0].period?.dateIn).format('DD MMMM YYYY') }}
                        </span>
                        <span class="i-carbon-arrow-right mx-1 inline-block h-4 w-4 text-sm" />
                        <span>
                          {{ dayjs(hotelDetails.offers[0].period?.dateIn).add(hotelDetails.offers[0].period?.nights - 1, 'day').format('DD MMMM YYYY') }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span class="text-zinc-4">
                        {{ hotelDetails.offers[0].period?.nights }} nights
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="my-5 flex items-end justify-between">
                    <span>
                      <span class="text-lg md:text-lg">
                        TOTAL
                      </span>
                      <span class="block text-zinc-5">(frais et taxes inclus)</span>
                    </span>

                    <span class="text-lg text-gray-900 font-light lg:text-3xl dark:text-white" :class="[selectedTariffChanged && 'animate__animated animate__bounce']">
                      {{ (selectedRoomOffer?.offer?.pricing?.amount?.afterTax || 0).toLocaleString('fr-FR', { style: 'currency', currency: selectedRoomOffer?.offer?.pricing?.currency || 'EUR' }) }}
                    </span>
                  </div>
                  <a-button :disabled="!selectedRoomOffer" long type="primary" html-type="submit" class="group !h-10" size="large">
                    <span class="flex-1 text-lg">
                      Réservez
                    </span>
                    <span
                      flex-0 h-full w-20 flex items-center justify-center rounded-r-2px
                      class="ml-2 bg-blue-9/20 px-2 -mr-[calc(1.25rem-1px)]"
                    >
                      <span class="h-7 w-7 transition-all group-hover:translate-x-15%" i-carbon-arrow-right />
                    </span>
                  </a-button>
                </div>
              </div>
            </div>
            <h1 class="mb-4 hidden text-center text-2xl text-gray-900 font-extrabold lg:block lg:text-2xl xl:text-5xl dark:text-white">
              <span class="from-sky-4 to-purple-4 bg-gradient-to-r bg-clip-text text-transparent">Les bons plans</span> du moment.
            </h1>
          </div>
          <!-- list offers -->
          <div class="flex overflow-hidden lg:flex-row lg:pr-2">
            <div class="w-full flex flex-1">
              <div v-if="rooms && !loadingGetRooms && !errorGetRooms" class="w-full flex flex-col space-y-2">
                <div v-for="(room, index) in rooms" :key="room.code" :class="[selectedRoomOffer?.roomCode === room.code ? 'border-blue-3 dark:border-blue-7 dark:bg-gray-8 bg-white' : 'border-gray-2 dark:border-gray-7 dark:bg-gray-8/65 bg-white/65']" class="border rounded-sm p-1 shadow-sm">
                  <div class="min-h-35 flex flex-col overflow-hidden xl:flex-row">
                    <img class="mr-2 h-full max-h-35 w-full rounded-2px object-cover md:h-auto xl:w-48" :src="`https://www.ahstatic.com/photos/${hotelDetails?.hotel?.id.toLowerCase()}_ro${room.code.toLowerCase()}_00_p_346x260.jpg`" alt="">
                    <div class="h-auto w-full flex flex-col justify-between">
                      <div class="">
                        <h5 class="my-1 text-xl text-gray-900 font-bold tracking-tight dark:text-white">
                          {{ room.roomClass?.label }}
                        </h5>
                        <div>
                          <ul class="">
                            <li v-for="amenitie in room.roomClass.amenities" :key="amenitie.name" class="flex items-center leading-5">
                              <span class="i-carbon-checkmark mr-1 inline-block h-4 w-4" />
                              {{ amenitie.label }}
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div class="mt-2 hidden justify-end md:flex space-x-2">
                        <h5 class="inline-block flex items-center text-sm">
                          <span class="flex-0 i-carbon-pedestrian-child mr-0.5 h-4 w-4 text-sm" />
                          <span>{{ room.capacity?.maxChild }} max child</span>
                        </h5>
                        <h5 class="inline-block flex items-center text-sm">
                          <span class="flex-0 i-carbon-person mr-0.5 h-4 w-4 text-sm" />
                          <span>{{ room.capacity?.maxAdult }} max adults</span>
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div class="[--animate-duration:0.3s] mt-2">
                    <a-collapse :default-active-key="[`0_${room.code}`]" :bordered="false">
                      <a-collapse-item :key="`${index}_${room.code}`" class="![&_.arco-collapse-item-content]:px-2">
                        <template #header>
                          <h4 class="font-semibold leading-4.2">
                            CHOISIR LE TARIF DE VOTRE CHAMBRE
                          </h4>
                        </template>
                        <template v-if="room.offers[0]" #extra>
                          <h5 class="md:text-md rounded-full bg-indigo-4/10 px-2.5 text-center text-sm text-gray-900 font-600 lg:block dark:bg-indigo-4/10 dark:text-white">
                            <span class="from-sky-3 to-purple-4 bg-gradient-to-r bg-clip-text text-transparent">From</span>
                            <span class="ml-1 font-500">
                              {{ (room.offers[0]?.pricing?.amount?.afterTax).toLocaleString('fr-FR', { style: 'currency', currency: room.offers[0]?.pricing?.currency || 'EUR' }) }}
                            </span>
                          </h5>
                        </template>
                        <div class="">
                          <a-radio-group v-model="selectedTariff" class="w-full flex flex-col space-y-2">
                            <template v-for="item in room.offers" :key="item.code">
                              <a-radio class="w-full !mr-0 !pl-0" :value="`${room.code}_${item.code}`" :class="[selectedTariff === `${room.code}_${item.code}` && 'animate__animated animate__pulse']">
                                <template #radio="{ checked }">
                                  <div
                                    class="custom-radio-card flex items-start"
                                    :class="{ 'custom-radio-card-checked': checked }"
                                  >
                                    <div class="custom-radio-card-mask">
                                      <div class="custom-radio-card-mask-dot" />
                                    </div>
                                    <div class="ml-2 w-full">
                                      <div class="custom-radio-card-title">
                                        {{ item?.label }}
                                      </div>
                                      <a-typography-text type="secondary">
                                        {{ item?.description }}
                                      </a-typography-text>
                                      <div text-right>
                                        <span class="text-lg text-gray-900 font-light lg:text-xl dark:text-white">
                                          {{ (item?.pricing?.amount?.afterTax).toLocaleString('fr-FR', { style: 'currency', currency: item?.pricing?.currency || 'EUR' }) }}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </template>
                              </a-radio>
                            </template>
                          </a-radio-group>
                        </div>
                      </a-collapse-item>
                    </a-collapse>
                  </div>
                </div>
              </div>
              <div v-if="loadingGetRooms" class="!w-full">
                <a-skeleton class="!w-full" :animation="true">
                  <a-space class="mb-8 !w-full" direction="vertical" size="large">
                    <a-skeleton-shape />
                    <a-skeleton-line :rows="3" />
                  </a-space>
                  <a-space class="!w-full" direction="vertical" size="large">
                    <a-skeleton-shape />
                    <a-skeleton-line :rows="3" />
                  </a-space>
                </a-skeleton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #fallback>
      <div class="top-0 h-full flex items-center justify-center bg-light-1/90 backdrop-blur backdrop-filter dark:bg-dark-9/90">
        <a-spin />
      </div>
    </template>
  </client-only>
</template>

<style lang="less">
.custom-radio-card {
  padding: 0.5rem;
  border: 1px solid var(--color-border-2);
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.custom-radio-card-mask {
  padding: 3px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  border: 1px solid var(--color-border-2);
  box-sizing: border-box;
}

.custom-radio-card-mask-dot {
  width: 8px;
  height: 8px;
  border-radius: 100%;
}

.custom-radio-card-title {
  color: var(--color-text-1);
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

.custom-radio-card:hover,
.custom-radio-card-checked,
.custom-radio-card:hover .custom-radio-card-mask,
.custom-radio-card-checked  .custom-radio-card-mask{
  border-color: rgb(var(--primary-6));
}

.custom-radio-card-checked {
  background-color: var(--color-primary-light-1);
}

.custom-radio-card:hover .custom-radio-card-title,
.custom-radio-card-checked .custom-radio-card-title {
  color: rgb(var(--primary-6));
}

.custom-radio-card-checked .custom-radio-card-mask-dot {
  background-color: rgb(var(--primary-6));
}
</style>
