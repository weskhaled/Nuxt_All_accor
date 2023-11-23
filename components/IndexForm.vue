<script setup lang="ts">
const emit = defineEmits(['popupVisibleChange', 'handleSearch'])
const { message } = useMessage()
const { dayjs } = useDayjs()
const optionsPlaces = ref([])
const formRef = ref(null)
const loadingPlaces = ref(false)
const filters = reactive(
  {
    destination: '',
    compositions: {
      adults: 1,
      childrenAges: [],
    },
    date: [dayjs().add(1, 'day').format('YYYY-MM-DD'), dayjs().add(5, 'day').format('YYYY-MM-DD')],
  },
)

async function handleSearchPlaces(value: string) {
  if (value.length < 2) {
    optionsPlaces.value = []
    return
  }
  loadingPlaces.value = true
  const { data } = await useFetch(`/api/autocomplete?q=${value}`)

  if (data.value) {
    const { data: list } = data.value
    optionsPlaces.value = list.map(p => p.description)
  }
  loadingPlaces.value = false
}
function handleSubmit({ values, errors }) {
  if (!errors) {
    emit('handleSearch', values)
    return
  }

  message.error({ content: `Error, please check the required input`, closable: true })
}
</script>

<template>
  <div
    class="relative z-2 ml-0 max-w-xl w-full border border-zinc-5/10 rounded-2px bg-white/80 p-5 shadow-black/3 shadow-sm backdrop-blur md:mt-7 dark:bg-black/80"
  >
    <a-form ref="formRef" class="[&_.arco-form-item-layout-vertical>.arco-form-item-label-col]:mb-0.5 [&_.arco-form-item]:mb-1 [&_.arco-form-item-label-required-symbol]:inline-flex ![&_.arco-form-item-label-col>.arco-form-item-label]:(text-sm/8 font-500)" layout="vertical" size="large" :model="filters" @submit="handleSubmit">
      <div class="md:mt-2">
        <a-form-item field="destination" label="Destination" :rules="[{ required: true, message: 'destination is required' }]">
          <a-auto-complete
            v-model="filters.destination"
            :trigger-props="{
              updateAtScroll: false,
              scrollToClose: true,
            }"
            allow-clear
            class="font-medium md:w-full !lt-md:[&_.arco-select-view-input]:max-w-220px"
            placeholder="Saisissez une ville, un code postal ou un département"
            :scrollbar="true"
            :bordered="true"
            :loading="loadingPlaces"
            :filter-option="false"
            :show-extra-options="false"
            :data="optionsPlaces"
            @popup-visible-change="(visible) => emit('popupVisibleChange', visible) "
            @search="handleSearchPlaces"
          />
        </a-form-item>
      </div>
      <div class="mt-2">
        <div class="w-full flex flex-col">
          <div class="hidden flex-1 md:flex">
            <a-form-item field="date" label="From To" :rules="[{ required: true, message: 'date is required' }]">
              <a-range-picker
                v-model:model-value="filters.date" :trigger-props="{
                  updateAtScroll: false,
                  scrollToClose: true,
                }"
                allow-clear :disabled-date="(current) => dayjs(current).isBefore(dayjs())" class="w-full" @popup-visible-change="(visible) => emit('popupVisibleChange', visible) "
              />
            </a-form-item>
          </div>
          <div class="flex-1 md:hidden">
            <a-form-item field="date" label="From" :rules="[{ required: true, message: 'date is required' }]">
              <a-date-picker
                v-model:model-value="filters.date[0]"
                class="w-full"
                size="large" :trigger-props="{
                  updateAtScroll: false,
                  scrollToClose: true,
                }"
                :disabled-date="(current) => dayjs(current).isBefore(dayjs())"
                @popup-visible-change="(visible) => emit('popupVisibleChange', visible) "
              >
                <template #cell="{ date }">
                  <div class="arco-picker-date">
                    <div class="arco-picker-date-value" :class="[(filters.date[0] && filters.date[1] && dayjs(date).isBetween(filters.date[0], filters.date[1], 'day', '(]')) && 'b-1px border-blue']">
                      {{ date.getDate() }}
                    </div>
                  </div>
                </template>
              </a-date-picker>
            </a-form-item>
            <a-form-item field="date" label="To" :rules="[{ required: true, message: 'date is required' }]">
              <a-date-picker
                v-model:model-value="filters.date[1]"
                class="w-full"
                size="large" :trigger-props="{
                  updateAtScroll: false,
                  scrollToClose: true,
                }"
                :disabled-date="(current) => dayjs(current).isBefore(dayjs(filters.date[0] || dayjs()))"
                @popup-visible-change="(visible) => emit('popupVisibleChange', visible) "
              >
                <template #cell="{ date }">
                  <div class="arco-picker-date">
                    <div class="arco-picker-date-value" :class="[(filters.date[0] && filters.date[1] && dayjs(date).isBetween(filters.date[0], filters.date[1], 'day', '[)')) && 'b-1px border-blue']">
                      {{ date.getDate() }}
                    </div>
                  </div>
                </template>
              </a-date-picker>
            </a-form-item>
          </div>
        </div>
      </div>
      <div class="md:mt-2">
        <a-form-item field="compositions" label="Sélectionnez vos voyageurs" :rules="[{ required: true, message: 'Sélectionnez vos voyageurs' }]">
          <a-trigger trigger="click" show-arrow scroll-to-close @popup-visible-change="(visible) => emit('popupVisibleChange', visible)">
            <a-button class="w-full">
              <span class="text-4.2 font-500">
                <span class="hidden md:inline-block">
                  Chambre pour
                </span>
                {{ +filters.compositions.adults }} Adult(s) | {{ +filters.compositions.childrenAges.length }} Enfant(s)
              </span>
            </a-button>
            <template #content>
              <div class="demo-arrow">
                <div>
                  <a-form-item class="!mb-2">
                    <div class="flex flex-1 space-x-1">
                      <div class="w-1/3 flex flex-1 flex-col">
                        <h4 class="mb-1 text-sm text-dark dark:text-light-1">
                          Adultes
                        </h4>
                        <a-input-number v-model="filters.compositions.adults" :default-value="1" size="small" placeholder="Adults" />
                      </div>
                      <div class="flex-0 w-2/3 flex flex-col">
                        <h4 class="mb-1 text-sm text-dark dark:text-light-1">
                          Childrens Age
                        </h4>
                        <a-input-tag v-model="filters.compositions.childrenAges" size="small" :default-value="[]" placeholder="Please Enter Ages" allow-clear />
                      </div>
                    </div>
                  </a-form-item>
                </div>
                <div />
              </div>
            </template>
          </a-trigger>
        </a-form-item>
      </div>
      <div class="flex-0">
        <div class="mt-2 w-full md:absolute md:right--6 md:top--6 md:w-60">
          <a-button type="primary" html-type="submit" class="group !h-9 !w-full" size="large">
            <span class="flex-1 text-4.2 font-500">
              Recherche
            </span>
            <span
              flex-0 h-full w-20 flex items-center justify-center rounded-r-2px
              class="ml-2 bg-blue-9/20 px-2 -mr-[calc(1.25rem-1px)]"
            >
              <span class="h-5 w-5 transition-all group-hover:scale-115%" i-carbon-search />
            </span>
          </a-button>
        </div>
      </div>
    </a-form>
    <div class="pt-3">
      <a href="javascript:;" class="text-3.8 font-medium font-general text-blue-8 dark:text-blue-1" @click="$router.push('/search')">Ma dernière recherche</a>
    </div>
  </div>
</template>

<style scoped>
.demo-arrow {
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  padding: 8px;
  width: 400px;
  background-color: var(--color-bg-popup);
  border-radius: 2px;
}
</style>
