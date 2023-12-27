<script setup lang="ts">
import { UseImage } from '@vueuse/components'

interface Props {
  hotelList?: any[]
  selectedHotelId?: any
  loadingHotelImages?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  hotelList: () => [],
  selectedHotelId: () => null,
})

const emit = defineEmits(['closeInfoWindow', 'showHotelImagesViewer', 'update:selectedHotelId', 'centerPosition', 'toggleHotelDetails'])

const { hotelList, selectedHotelId } = useVModels(props, emit)
</script>

<template>
  <div
    v-for="{ index, data: item } in hotelList" :key="index" :tabindex="index"
    :class="[item.status === 'OPEN' ? 'opacity-100 dark:bg-dark-9/30 bg-light-2/30' : 'opacity-80 dark:bg-red-9/30 bg-red-2/30', selectedHotelId === item.hotel.id && '!bg-blue-5/45']"
    class="card h-170px w-full flex overflow-hidden border-1px border-bluegray-5/10 rounded-1 p-2 shadow-sm"
  >
    <div class="flex-0 relative mr-2 h-full w-35 overflow-hidden rounded-1 bg-light-1 md:w-60 dark:bg-black">
      <a-spin
        class="h-full w-full flex items-center text-sm"
        :loading="loadingHotelImages === item.hotelCode.toLowerCase()"
      >
        <a-image
          :preview="false" show-loader class="cover h-full w-full flex cursor-pointer items-center"
          :src="`https://www.ahstatic.com/photos/${item.hotelCode.toLowerCase()}_ho_00_p_346x260.jpg`"
          @click="emit('showHotelImagesViewer', item.hotelCode.toLowerCase())"
        />
      </a-spin>
      <div
        v-if="item.hotel.media?.count"
        class="absolute bottom-1 left-1 flex items-center rounded-1 bg-light-1/75 p-2 dark:bg-black/75"
      >
        <span class="i-carbon-image-copy mr-1 inline-block h-4 w-4 text-sm" />
        {{ item.hotel.media?.count }}
      </div>
      <div class="absolute right-1 top-auto flex items-center rounded-1 bg-light-1/75 p-1 lt-sm:bottom-1 md:top-1">
        <UseImage
          class="h-8 w-8 fill-current text-dark-6"
          :src="`/img/hotels-brands/${item.hotel.brand}.svg`"
        >
          <template #loading>
            Loading..
          </template>

          <template #error>
            <span class="h-8 w-8 flex items-center overflow-hidden truncate text-dark-6">
              {{ item.hotel?.brand }}
            </span>
          </template>
        </UseImage>
      </div>
    </div>
    <div class="flex flex-1 flex-col justify-between overflow-hidden">
      <div class="mb-1">
        <div class="flex justify-between">
          <h4
            :title="item.hotel.name"
            class="flex-1 overflow-hidden truncate text-lg font-600 font-sans"
          >
            {{ item.hotel.name }}
          </h4>
          <div class="flex-0 flex space-x-1">
            <a-dropdown tabindex="0">
              <a-tooltip content="Actions" position="tr" mini>
                <a-button role="button" tabindex="0" size="small" shape="circle" class="" type="text">
                  <template #icon>
                    <span class="i-carbon-overflow-menu-horizontal block h-5 w-5 text-sm" />
                  </template>
                </a-button>
              </a-tooltip>
              <template #content>
                <a-doption tabindex="0" @click="() => (selectedHotelId = item.hotel?.id, emit('centerPosition', item.hotel))">
                  Sélectionner on maps
                </a-doption>
                <a-doption
                  tabindex="1"
                  :disabled="selectedHotelId !== item.hotel?.id"
                  @click="() => (selectedHotelId === item.hotel?.id && (selectedHotelId = null, emit('closeInfoWindow')))"
                >
                  Désélectionner
                </a-doption>
                <a-doption :disabled="item.status !== 'OPEN'" tabindex="0" @click="() => (selectedHotelId = item.hotel?.id, emit('toggleHotelDetails', true), emit('centerPosition', item.hotel))">
                  Voir les chambres
                </a-doption>
                <a-doption>Save</a-doption>
              </template>
            </a-dropdown>
            <a-tooltip content="Toggle in love" position="br" mini>
              <a-button status="danger" shape="circle" size="small" class="" type="text">
                <template #icon>
                  <span class="i-carbon-favorite mx-1 block h-4 w-4 text-sm" />
                </template>
              </a-button>
            </a-tooltip>

            <template v-if="item.status !== 'OPEN'">
              <a-tooltip content="Indisponible aux dates sélectionnées" position="br" mini>
                <a-button status="warning" shape="circle" size="small" class="" type="text">
                  <template #icon>
                    <span class="i-carbon-warning-filled mx-1 block h-4 w-4 text-sm" />
                  </template>
                </a-button>
              </a-tooltip>
            </template>
          </div>
        </div>
      </div>

      <div class="h-full flex-1">
        <div class="h-full flex flex-col justify-between text-slate-6 md:flex-row dark:text-slate-3">
          <div class="flex flex-1 flex-col justify-between">
            <div class="relative mb-auto flex flex-col">
              <div class="">
                <div class="relative flex items-center">
                  <div class="mt-1 flex items-center">
                    <span v-for="s in new Array(5).fill(0).map((_, i) => ++i)" :key="s" class="relative mr-0.5 inline-block">
                      <span :class="[s <= Number.parseFloat(item.hotel?.rating?.star?.score || 0) ? 'i-carbon-star-filled text-yellow-4' : 'i-carbon-star text-yellow-4/35']" class="block h-4 w-4 text-sm" />
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="item.hotel.rating?.trustyou?.score" class="my-1 flex">
                <div class="mr-1 lt-sm:hidden">
                  <a-progress :show-text="false" class="!w-21" status="success" :percent="+((((item.hotel?.rating?.trustyou?.score || 0) * 100) / 5)).toFixed() / 100" />
                </div>
                <span font-semibold>{{ item.hotel.rating?.trustyou?.score || 0 }} / 5</span>
              </div>
              <div class="flex-0 text-md mt-1 flex">
                <span>{{ item.hotel.rating?.trustyou?.nbReviews || 0 }} reviews</span>
              </div>
            </div>
            <h4 v-if="item.hotel.localization?.address?.street" class="flex-0 hidden items-center overflow-hidden pr-2 text-sm md:flex">
              <span :title="item.hotel.localization?.address?.street" class="i-carbon-location flex-0 mr-1 h-4 w-4 text-sm" />
              <span class="overflow-hidden truncate">
                {{ item.hotel.localization?.address?.street }}
              </span>
            </h4>
          </div>
          <div class="flex-0 min-w-40 flex flex-col justify-end text-lg">
            <template v-if="item.status === 'OPEN'">
              <div>
                <h3 class="hidden text-sm md:inline-block">
                  Tarif à partir de
                </h3>
              </div>
              <div
                v-for="offre in item.offers" :key="offre.code"
                class="flex items-center justify-end text-slate-8 dark:text-slate-1"
              >
                <span v-if="item.offers.length > 1" class="mr-auto text-sm">
                  {{ offre.categories[0]?.code
                    === 'STANDARD' ? 'Public' : 'Membre' }} :
                </span>
                <span class="ml-1 flex">
                  <span class="font-semibold">
                    {{ +offre.pricing.stay.afterTax.toFixed() }}
                  </span>
                  <span class="text-xs">
                    {{ offre.pricing.currency === 'EUR' ? '€' : '$' }}
                  </span>
                </span>
              </div>
              <div v-if="item.offers?.length > 0" class="hidden md:flex space-x-2">
                <h5 class="inline-block flex items-center text-sm">
                  <span class="i-carbon-sunset flex-0 mr-0.5 h-4 w-4 text-sm" />
                  <span>{{ item.offers[0]?.period.nights }} nuits</span>
                </h5>
                <h5 class="inline-block flex items-center text-sm">
                  <span class="flex-0 i-carbon-person mr-0.5 h-4 w-4 text-sm" />
                  <span>{{ item.offers[0].effectiveOccupancy?.adults }} adults</span>
                </h5>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.card {
  animation: fadeIn linear;
  animation-range: entry;
  animation-timeline: view(y);
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
