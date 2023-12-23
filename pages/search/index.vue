<script setup lang="ts">
import { promiseTimeout, until, useGeolocation, useScroll, useVirtualList, watchDebounced } from '@vueuse/core'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import { useFuse } from '@vueuse/integrations/useFuse'
import { useRouteQuery } from '@vueuse/router'
import { A } from '@mobily/ts-belt'

definePageMeta({
  layout: 'main',
})

const { dayjs } = useDayjs()
const mapRef = ref<HTMLElement | null>()
const { googleMapsApi, gMapsInstance, googleMapsCoreApi, MarkerClusterer, mapTools } = useGoogleMaps(mapRef)
// const { coords } = useGeolocation()

const nightsRouteQuery = useRouteQuery('nights')
const searchHotelInput: any = useRouteQuery('searchHotelInput')
const showHotelRoomsRouteQuery: any = useRouteQuery('showHotelRooms', null)
const destinationRouteQuery = useRouteQuery('destination', 'Paris')
const selectedHotelIdRouteQuery = useRouteQuery('selectedHotelId')
const dateFromRouteQuery = useRouteQuery('dateFrom', dayjs().format('YYYY-MM-DD'))
const dateToRouteQuery = useRouteQuery('dateTo', dayjs().add(5, 'day').format('YYYY-MM-DD'))
const compositionsRouteQuery = useRouteQuery('compositions', '{}', { transform: value => JSON.parse(decodeURIComponent(value)) })

const isMounted = useMounted()
let infoWindow: any = null
let markerClusterer: any = null
let markers: any = []
let latlngbounds: any = null

const keySort = ref([
  { value: 'price', label: 'Prix' },
  { value: 'review', label: 'Note client' },
  { value: 'star', label: 'Etoiles' },
])
const optionsPlaces = ref([])
const loadingPlaces = ref(false)
const layoutView = ref('MAP')
const viewInMap = ref(false)
// const showHotelDetails = ref(false)
const visibleDrawer = ref(false)
const visibleImgViewer = ref(false)
const loadingHotelImages: Ref<string | null> = ref(null)
const srcListImgs = ref([])
const selectedHotelId = ref(toValue(selectedHotelIdRouteQuery))
const showHotelsListHeader = ref(false)
const filters = reactive({
  sortBy: 'price',
  sortOrder: 'DESC',
  destination: destinationRouteQuery.value,
  date: [(dayjs(dateFromRouteQuery.value || dayjs())).format('YYYY-MM-DD'), (dayjs(dateToRouteQuery.value || dayjs())).format('YYYY-MM-DD')],
  showAllResult: true,
  searchInput: '',
})
const errorGetHotels: Ref<any> = ref(null)
const loadingGetHotels = ref(true)
const availableHotels = ref([])
const unavailableHotels = ref([])
const totalHotels = ref(0)

function sortHotelsBy(h: any, sortBy: string, order: string) {
  const byPrice = h => order === 'DESC' ? -h?.offers[0]?.pricing?.stay?.afterTax : +h?.offers[0]?.pricing?.stay?.afterTax
  const byReview = h => order === 'DESC' ? (-h.hotel?.rating?.trustyou?.score || 0) : (+h.hotel?.rating?.trustyou?.score || 0)
  const byStar = h => order === 'DESC' ? -Number.parseFloat(h.hotel?.rating?.star?.score || 0) : +Number.parseFloat(h.hotel?.rating?.star?.score || 0)
  const byDistance = h => order === 'DESC' ? -h.hotel?.rating?.star?.score : +h.hotel?.rating?.star?.score

  switch (sortBy) {
    case 'price':
      return byPrice(h)
    case 'review':
      return byReview(h)
    case 'star':
      return byStar(h)
    default:
      return byDistance(h)
  }
}

const options = computed<UseFuseOptions<any>>(() => ({
  fuseOptions: {
    keys: ['hotel.name'],
    includeScore: false,
    shouldSort: false,
    includeMatches: true,
    minMatchCharLength: 3,
    useExtendedSearch: true,
  },
  resultLimit: 0,
  matchAllWhenSearchEmpty: true,
}))

const filteredItems = computed(() => {
  let hotels: any = toValue(availableHotels)
  if (searchHotelInput.value && searchHotelInput.value?.length > 3)
    hotels = useFuse(`'${searchHotelInput.value}`, hotels, options).results?.value?.map(i => i.item)

  const sortedAvailableHotels = A.sortBy(hotels, h => sortHotelsBy(h, filters.sortBy, filters.sortOrder))

  return filters.showAllResult
    ? [...sortedAvailableHotels, ...(searchHotelInput.value ? [] : unavailableHotels.value)]
    : availableHotels.value
})

const selectedHotelForDetails = computed(() => {
  if (!selectedHotelIdRouteQuery.value || !filteredItems.value.length)
    return null

  return filteredItems.value.find(h => h?.hotelCode === selectedHotelIdRouteQuery.value) ?? null
})

useSeoMeta({
  title: computed(() => selectedHotelForDetails.value?.hotel?.name || `All Accor Search ${destinationRouteQuery.value}`),
  description: computed(() => selectedHotelForDetails.value?.hotel?.seoDescription || `All Accor Search ${destinationRouteQuery.value}`),
})

const selectedHotelIndex = computed(() => {
  if (!selectedHotelIdRouteQuery.value?.length)
    return -1

  return filteredItems.value.findIndex(i => `${i.hotel.id}` === `${selectedHotelIdRouteQuery.value}`)
})

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  filteredItems,
  {
    itemHeight: 175,
    overscan: 10,
  },
)

const hotelsLocations = computed(() => {
  return availableHotels.value.map((h: any) => ({
    position: h.hotel?.localization?.gps,
    id: h.hotel.id,
    name: h.hotel.name,
    brand: h.hotel.brand,
    contact: h.hotel.contact,
  }))
})

const containerListRef = computed(() => containerProps?.ref?.value)
const lastScrollInContainerList = ref('down')
const { y, isScrolling, directions } = useScroll(containerListRef)

watchEffect(() => {
  if (isScrolling.value)
    lastScrollInContainerList.value = directions.top ? 'up' : 'down'
})

useAsyncData(
  async () => {
    loadingGetHotels.value = true
    errorGetHotels.value = null
    availableHotels.value = []
    unavailableHotels.value = []
    totalHotels.value = 0

    const destination = `${destinationRouteQuery.value}`
    const dateIn = dateFromRouteQuery.value
    const compositions = JSON.stringify(compositionsRouteQuery.value)
    const nights = dayjs(dateToRouteQuery.value).diff(dateFromRouteQuery.value, 'day') + 1

    return await useFetch(`/api/hotels?destination=${encodeURIComponent(destination)}&dateIn=${dateIn}&nights=${nights || 1}&compositions=${compositions}`).then(({ data, error }) => {
      if (data.value) {
        availableHotels.value = data.value?.data?.available || []
        unavailableHotels.value = data.value?.data?.unavailable || []
        totalHotels.value = data.value?.total || 0
      }
      else if (error.value) {
        errorGetHotels.value = error.value
        deleteMarkers()
      }
      loadingGetHotels.value = false
    })
  },
  {
    watch: [destinationRouteQuery, dateFromRouteQuery, dateToRouteQuery],
  },
)

async function initMarkerClusterer() {
  deleteMarkers()
  latlngbounds = new googleMapsCoreApi.value.LatLngBounds()

  if (hotelsLocations.value.length) {
    markers = hotelsLocations.value?.map((hotel) => {
      const position = new googleMapsCoreApi.value.LatLng(Number.parseFloat(hotel.position.lat), Number.parseFloat(hotel.position.lng))
      const marker = new mapTools.Marker({
        position,
        // icon: 'https://api.iconify.design/emojione-v1:house.svg?color=%23ffffff&width=30px',
        opacity: 1,
        map: gMapsInstance.value,
      })

      marker.addListener('click', () => {
        selectedHotelIdRouteQuery.value === hotel.id ? (selectedHotelIdRouteQuery.value = null) : (selectedHotelIdRouteQuery.value = hotel.id)
        if (!selectedHotelIdRouteQuery.value) {
          infoWindow?.close()
          return
        }

        infoWindow.setContent(`
          <h3 class="font-semibold text-sm text-gray-8 mb-1">${hotel.name}</h3>
          <h3 class="font-semibold text-xs text-gray-6 mb-1">${hotel.contact?.mail}</h3>
          <h3 class="font-semibold text-xs text-gray-6">(+${hotel.contact?.phonePrefix})${hotel.contact?.phone}</h3>
        `)
        infoWindow.open({
          anchor: marker,
          map: gMapsInstance.value,
          shouldFocus: true,
        })
      })
      latlngbounds?.extend(position)
      return marker
    })

    if (!markerClusterer) {
      markerClusterer = new MarkerClusterer({ markers })
      markerClusterer.setMap(gMapsInstance.value)
    }
    else {
      reinsertMarkers()
    }

    gMapsInstance.value.setCenter(latlngbounds.getCenter())
    gMapsInstance.value.fitBounds(latlngbounds)
  }
}

watch([() => googleMapsApi.value, () => hotelsLocations.value], () => {
  if (googleMapsApi.value)
    initMarkerClusterer()
})

watchOnce(() => googleMapsApi.value, () => {
  infoWindow = new mapTools.InfoWindow({
    content: '',
    disableAutoPan: true,
  })
  latlngbounds = new googleMapsCoreApi.value.LatLngBounds()
})

watch(() => selectedHotelIndex.value, async (value) => {
  if (!value || value < 0)
    return

  scrollTo(value)
  await promiseTimeout(200)
  lastScrollInContainerList.value = 'up'
})

function deleteMarkers() {
  markers.forEach((marker) => {
    marker.setMap(null)
  })

  markers = []
}

function reinsertMarkers() {
  if (markerClusterer) {
    markerClusterer.clearMarkers()
    markerClusterer.addMarkers(markers)
  }
}

async function handleSearchPlaces(value: string) {
  if (value.length < 2) {
    optionsPlaces.value = []
    return
  }
  loadingPlaces.value = true
  const { data } = await useFetch(`/api/autocomplete?q=${value}`)

  if (data.value) {
    const { data: list } = data.value
    optionsPlaces.value = list.map(p => ({ label: p.description, value: p.description }))
  }
  loadingPlaces.value = false
}

async function showHotelImagesViewer(id: string) {
  if (!id) {
    srcListImgs.value = []
    return
  }
  loadingHotelImages.value = id
  const { data } = await useFetch(`/api/mediasHotels?id=${id}`)

  if (data.value) {
    srcListImgs.value = data.value?.data.map(i => i.path)
    await nextTick()
    visibleImgViewer.value = true
  }
  loadingHotelImages.value = null
}

async function centerPosition(hotel) {
  const { lat, lng } = hotel?.localization?.gps

  if (!lat || !lng || !googleMapsCoreApi.value || !gMapsInstance.value)
    return

  const center = new googleMapsCoreApi.value.LatLng(Number.parseFloat(lat), Number.parseFloat(lng))
  gMapsInstance.value.setCenter(center)
  gMapsInstance.value.setZoom(19)
  const foundedMarker = markers.find(marker => marker.getPosition().lat() === +lat && marker.getPosition().lng() === +lng)

  if (!foundedMarker)
    return

  infoWindow.setContent(`
    <h3 class="font-semibold text-sm text-gray-8 mb-1">${hotel.name}</h3>
    <h3 class="font-semibold text-xs text-gray-6 mb-1">${hotel.contact?.mail}</h3>
    <h3 class="font-semibold text-xs text-gray-6">(+${hotel.contact?.phonePrefix})${hotel.contact?.phone}</h3>
  `)
  infoWindow.open({
    anchor: foundedMarker,
    map: gMapsInstance.value,
    shouldFocus: true,
  })
}

watchDebounced(
  [
    () => filters.destination,
    () => filters.date[0],
    () => filters.date[1],
  ],
  () => {
    if (filters.destination && filters.date[0] && filters.date[1]) {
      destinationRouteQuery.value = filters.destination

      dateFromRouteQuery.value = dayjs(filters.date[0]).format('YYYY-MM-DD')
      dateToRouteQuery.value = dayjs(filters.date[1]).format('YYYY-MM-DD')
      const nights = dayjs(filters.date[1]).diff(filters.date[0], 'day') + 1
      nightsRouteQuery.value = `${nights}`

      // compositionsRouteQuery.value = `{}`
    }
  },
  { debounce: 0, maxWait: 1000 },
)

watchDebounced(
  [
    () => filters.searchInput,
  ],
  async ([searchInputValue]) => {
    if (searchInputValue && searchInputValue.length > 3)
      searchHotelInput.value = searchInputValue

    else
      searchHotelInput.value = null

    await nextTick()
    scrollTo(0)
  },
  { debounce: 300, maxWait: 1000 },
)

onMounted(async () => {
  filters.searchInput = searchHotelInput.value
  await until(googleMapsCoreApi).changed()
  await until(gMapsInstance).changed()
  await promiseTimeout(1000)
  if (selectedHotelForDetails.value) {
    centerPosition(selectedHotelForDetails.value?.hotel)
  }
  else {
    await until(selectedHotelForDetails).changed()
    toValue(selectedHotelForDetails)?.hotel && centerPosition(toValue(selectedHotelForDetails)?.hotel)
  }
})
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="max-h-full flex flex-1 flex-col-reverse md:flex-row dark:text-white">
      <div
        class="relative z-5 h-full w-2/2 flex flex-1 overflow-hidden border-bluegray-2 rounded-t-md 2xl:w-4/7 md:w-4/5 xl:w-5/7 xl:border-r-1px dark:border-bluegray-9 md:rounded-0"
      >
        <!-- list hotels -->
        <div
          :class="[selectedHotelForDetails && showHotelRoomsRouteQuery && 'delay-200 -translate-x-[calc(100%-50px)] shadow-md b-r-1px dark:border-bluegray-9 border-bluegray-2']"
          class="relative z-3 h-full w-full flex overflow-hidden transition-transform-200"
        >
          <!-- overlay -->
          <div
            v-if="isMounted && selectedHotelForDetails && showHotelRoomsRouteQuery"
            class="fixed right-0 top-0 z-5 h-screen w-full bg-light/50 backdrop-blur-1px transition-all duration-400 dark:bg-black/70"
            @click="() => (showHotelRoomsRouteQuery = null, selectedHotelIdRouteQuery = null)"
          />
          <div
            v-bind="containerProps"
            :class="[selectedHotelForDetails && showHotelRoomsRouteQuery ? '!overflow-hidden' : 'overflow-auto']"
            class="my-scrollbar relative z-4 h-full w-full flex flex-col"
          >
            <div
              :class="[(!showHotelsListHeader && y > 125 && lastScrollInContainerList === 'down') ? 'top--20' : 'top-0 ']"
              class="content-header sticky z-3 border-b-1px border-bluegray-9/5 bg-light-2/90 p-2 pb-0 shadow-sm backdrop-blur backdrop-filter transition-all-200 delay-0.2s dark:border-bluegray-1/5 dark:bg-dark-9/90"
            >
              <div class="flex items-center justify-between space-x-2">
                <h1 class="my-1 inline-block max-w-full flex-1 overflow-hidden truncate text-sm leading-7 md:text-xl">
                  <span class="mr-1">
                    <ClientOnly>
                      <span v-if="loadingGetHotels">
                        <a-spin
                          class="h-5 w-5 [&_.arco-spin-icon]:(h-full w-full flex items-center justify-center text-4)"
                        />
                      </span>
                      <span v-else>{{ totalHotels }}</span>

                      <template #fallback>
                        <a-spin />
                      </template>
                    </ClientOnly>
                  </span>
                  <span class="hidden lg:inline-block">Hébergements proches de&nbsp;</span>
                  <span class="inline-block lg:hidden">Hébergements /&nbsp;</span>
                  <span class="font-semibold">
                    {{ destinationRouteQuery }}
                  </span>
                </h1>
                <div class="max-w-65 flex items-center md:w-3/8 space-x-1">
                  <a-button type="secondary" long class="group !pl-0 !font-semibold" size="medium" status="success">
                    <span class="hidden flex-1 lg:flex lg:px-2">
                      Share
                    </span>
                    <span
                      class="h-full w-12 flex items-center justify-center rounded-2px bg-dark-9/10 px-1 -mr-[calc(1rem-1px)]"
                    >
                      <span class="h-4 w-4 transition-all group-hover:scale-110%" i-carbon-share />
                    </span>
                  </a-button>
                  <a-button type="secondary" class="group !pl-0 !font-semibold" size="medium" status="danger">
                    <span class="hidden flex-1 lg:flex lg:px-2">
                      Save Search
                    </span>
                    <span
                      class="h-full w-12 flex items-center justify-center rounded-2px bg-dark-9/10 px-1 -mr-[calc(1rem-1px)]"
                    >
                      <span class="h-4 w-4 transition-all group-hover:scale-110%" i-carbon-favorite />
                    </span>
                  </a-button>
                </div>
              </div>
              <div class="mt-1">
                <div class="flex items-center space-x-2">
                  <div class="max-w-70 flex-1">
                    <a-select
                      v-model="filters.destination" class="w-full !font-semibold" :loading="loadingPlaces"
                      :options="optionsPlaces" placeholder="Please select ..." allow-search
                      @search="handleSearchPlaces"
                    />
                  </div>
                  <div class="flex-1">
                    <a-range-picker
                      v-model:model-value="filters.date" :allow-clear="false"
                      :disabled-date="(current) => dayjs(current).isBefore(dayjs())" class="w-full !font-semibold"
                    />
                  </div>
                  <div>
                    <a-button type="primary" class="group lg:min-w-45 !pl-0 !font-semibold" size="medium" @click="() => visibleDrawer = true">
                      <span class="hidden flex-1 lg:flex lg:px-2">
                        Recherche avancée
                      </span>
                      <span
                        class="flex-0 h-full w-12 flex items-center justify-center rounded-2px bg-dark-9/10 px-1 -mr-[calc(1rem-1px)]"
                      >
                        <span class="h-4 w-4 transition-all group-hover:scale-110%" i-carbon-search />
                      </span>
                    </a-button>
                  </div>
                </div>
              </div>
              <div class="z-6 h-14 flex items-center justify-between py-2 space-x-2">
                <div class="relative h-full flex flex-1 overflow-hidden space-x-2">
                  <h3
                    class="flex flex-1 items-center overflow-hidden truncate opacity-100 transition-all delay-0.2s"
                    :class="[(y < 125 || lastScrollInContainerList === 'up') && 'invisible opacity-0']"
                  >
                    <ClientOnly>
                      <span>
                        <template v-if="loadingGetHotels">
                          <a-spin
                            class="mr-0.5 h-4 w-4 [&_.arco-spin-icon]:(h-full w-full flex items-center justify-center text-3)"
                          />
                        </template>
                        <template v-else>
                          {{ totalHotels }}
                        </template>
                      </span>
                      <template #fallback>
                        <a-spin />
                      </template>
                    </ClientOnly>
                    &nbsp;Hébergements /&nbsp;
                    <span class="truncate font-semibold">
                      {{ destinationRouteQuery }}
                    </span>
                  </h3>
                  <div class="hidden items-center md:flex !2xl:w-122.5 !md:w-65">
                    <a-input-search
                      v-model="filters.searchInput" allow-clear search-button class="w-full"
                      placeholder="Please enter something"
                    />
                  </div>
                </div>
                <div class="max-w-65 md:w-3/8">
                  <div class="w-full w-full flex flex items-center">
                    <div class="w-full flex flex-1 items-center">
                      <a-select
                        v-model="filters.sortBy" :options="keySort" class="w-full flex-1" size="medium"
                        placeholder="Trier par" :bordered="true" @change="selectedHotelId = null, scrollTo(0)"
                      />
                      <a-button
                        :disabled="!filters.sortBy" type="dashed" size="medium" class="ml-2 flex-none"
                        @click="() => (filters.sortOrder === 'ASC' ? (filters.sortOrder = 'DESC') : (filters.sortOrder = 'ASC'), selectedHotelId = null, scrollTo(0))"
                      >
                        <i
                          :class="[filters.sortOrder === 'ASC' ? 'i-carbon-sort-ascending' : 'i-carbon-sort-descending']"
                          class="h-5 w-5"
                        />
                      </a-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- hotel list -->
            <Suspense>
              <!-- component with nested async dependencies -->
              <div class="mb-10.25 flex flex-1 bg-light-2/95 p-5px md:mb-0 dark:bg-dark-9/95">
                <div class="relative w-full flex flex-1 flex-col">
                  <div v-if="isMounted && !loadingGetHotels && !errorGetHotels" v-bind="wrapperProps" class="h-full p-0">
                    <div class="list flex flex-col space-y-5px">
                      <HotelList
                        v-model:loadingHotelImages="loadingHotelImages" v-model:hotelList="list"
                        v-model:selectedHotelId="selectedHotelIdRouteQuery"
                        @toggle-hotel-details="(value) => showHotelRoomsRouteQuery = value"
                        @center-position="centerPosition" @show-hotel-images-viewer="showHotelImagesViewer"
                        @close-info-window="(infoWindow?.close(), gMapsInstance.setZoom(11))"
                      />
                    </div>
                  </div>
                  <div v-if="loadingGetHotels && !errorGetHotels" class="top-0 h-full flex items-center justify-center">
                    <a-spin />
                  </div>
                  <div
                    v-if="!loadingGetHotels && (!list.length || errorGetHotels || (!errorGetHotels && totalHotels === 0))"
                    class="top-0 h-full flex items-center justify-center"
                  >
                    <a-result
                      :status="errorGetHotels ? 'error' : '404'"
                      :title="errorGetHotels ? 'Error' : `Aucun hébergement ne correspond exactement à votre recherche. À proximité, d'autres hébergements peuvent vous intéresser.`"
                    >
                      <template v-if="errorGetHotels" #subtitle>
                        {{ errorGetHotels }}
                      </template>
                    </a-result>
                  </div>
                </div>
              </div>
              <!-- loading state via #fallback slot -->
              <template #fallback>
                <div class="top-0 h-full flex items-center justify-center">
                  <a-spin />
                </div>
              </template>
            </Suspense>
          </div>
        </div>
        <!-- hotel details -->
        <div class="my-scrollbar absolute top-0 z-2 h-full w-full flex overflow-auto bg-white/80 dark:bg-black/80">
          <div class="relative h-full w-full p-0 pl-50px">
            <HotelDetails
              v-model="showHotelRoomsRouteQuery" v-model:hotelDetails="selectedHotelForDetails"
              v-model:selectedHotelId="selectedHotelIdRouteQuery" @show-hotel-images-viewer="showHotelImagesViewer"
            />
          </div>
        </div>
      </div>
      <!-- google maps -->
      <div
        class="right-0 top-0 z-2 z-4 mt--0 h-1/2 flex p-0 transition-all md:h-full md:p-0"
        :class="[layoutView !== 'MAP' ? 'w-2/2' : 'w-2/2 md:w-1/5 xl:w-2/7 2xl:w-3/7 z-3', viewInMap && (layoutView === 'MAP' ? 'lt-md:pb-70px' : 'lt-md:pr-50px'), layoutView === 'MAP' ? (viewInMap ? 'lt-md:h-full' : 'lt-md:h-40%') : 'lt-md:h-full', selectedHotelForDetails && showHotelRoomsRouteQuery && 'delay-0 !md:w-55']"
      >
        <div
          id="maps" ref="mapRef"
          class="h-full min-h-full w-full flex shadow-sm lt-md:h-[calc(100%+1.25rem)] md:border-0 md:rounded-0"
        />
      </div>
    </div>
  </div>
  <ClientOnly>
    <a-image-preview-group v-model:visible="visibleImgViewer" infinite :src-list="srcListImgs" />
    <a-drawer
      placement="left" popup-container="#layoutMain"
      class="!z-99 ![&_.arco-drawer]:w-85% ![&_.arco-drawer-header]:border-b-stone-2 !md:[&_.arco-drawer]:w-35% !dark:[&_.arco-drawer-header]:border-b-stone-9"
      :visible="visibleDrawer" unmount-on-close @ok="() => visibleDrawer = false" @cancel="() => visibleDrawer = false"
    >
      <template #title>
        Title
      </template>
      <div class="">
        You can customize modal body text by the current situation. This modal will be closed immediately once you
        press the OK button.
      </div>
    </a-drawer>
  </ClientOnly>
</template>

<style scoped lang="less">
.demo-arrow {
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  background-color: var(--color-bg-popup);
}
</style>
