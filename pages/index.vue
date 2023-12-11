<script setup lang="ts">
import { UseElementVisibility } from '@vueuse/components'
import IndexForm from '~/components/IndexForm.vue'

const router = useRouter()
const { dayjs } = useDayjs()
const allowTouchMove = ref(true)

const sliders: Ref<any[]> = ref([
  {
    title: 'Intro',
    content: h('div', { class: 'text-left ml-0 font-general flex flex-col h-full' }, [
      h('h1', { class: 'font-sans text-white my-1 md:my-3 font-bold uppercase text-1.3rem md:text-4.5rem leading-tight ![--animate-delay:0.1s] animate__animated animate__slideInDown' }, 'Réservez au meilleur prix'),
      h('div', { class: 'text-left flex w-full ml-auto ![--animate-delay:5.15s]' }),
      h('div', { class: 'text-left flex w-full ml-auto ![--animate-delay:5.15s]' }, [h(IndexForm, { onPopupVisibleChange(visible) { allowTouchMove.value = !visible }, onHandleSearch: handleSearch, class: 'mx-auto animate__animated animate__slideInDown' })]),
    ]),
    image: {
      screen: 'https://www.ahstatic.com/photos/8244_ho_04_p_1024x768.jpg',
      thumb: 'https://www.ahstatic.com/photos/8244_ho_04_p_346x260.jpg',
    },
  },
  {
    title: 'Intro',
    content: h('div', { class: 'text-left max-w-3xl ml-0 font-general flex flex-col' }, [h('h1', { class: 'font-chillax font-semibold uppercase text-1.6rem md:text-3.2rem leading-tight ![--animate-delay:0.1s] animate__animated animate__slideInDown' }, 'Demain commence ici 👋'), h('p', { class: 'font-thin text-5 ![--animate-delay:0.15s] animate__delay-2s animate__animated animate__backInUp' }, '')]),
    image: {
      screen: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&q=80&w=900&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      thumb: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&q=80&w=200&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  },
  {
    title: 'Intro',
    content: h('div', { class: 'text-left max-w-3xl ml-0 font-general flex flex-col' }, [h('h1', { class: 'font-chillax font-semibold uppercase text-1.6rem md:text-3.2rem leading-tight ![--animate-delay:0.1s] animate__animated animate__slideInDown' }, 'Demain commence ici 👋'), h('p', { class: 'font-thin text-5 ![--animate-delay:0.15s] animate__delay-2s animate__animated animate__backInUp' }, '')]),
    image: {
      screen: 'https://images.unsplash.com/photo-1471623320832-752e8bbf8413?auto=format&fit=crop&q=80&w=900&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      thumb: 'https://images.unsplash.com/photo-1471623320832-752e8bbf8413?auto=format&fit=crop&q=80&w=200&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  },
])

async function handleSearch(filters: any) {
  const { destination, date, compositions } = filters

  const nights = dayjs(date[1]).diff(date[0], 'day') + 1
  await router.push(`/search?destination=${destination}&dateFrom=${date[0]}&dateTo=${date[1]}&nights=${nights}&compositions=${encodeURIComponent(JSON.stringify(compositions))}`)
}
</script>

<template>
  <div class="mx-auto bg-light-1 shadow-sm 2xl:container dark:bg-dark-9">
    <div class="relative mx-auto shadow-xl">
      <section class="relative font-sans !mt--14.5">
        <CommonHeroSlider
          v-model:allow-touch-move="allowTouchMove" :grab-cursor="true"
          class="h-[calc(100vh-0rem)] !max-h-70rem !min-h-400px md:h-[calc(100vh)]" :sliders="sliders"
        />
      </section>
    </div>
    <section class="">
      <div mx-auto container>
        <main class="px-5 py-5">
          <div class="grid grid-cols-1 mx-auto lg:grid-cols-2 lg:gap-x-20">
            <div
              class="relative col-start-1 row-start-1 flex flex-col-reverse rounded-lg from-black/75 via-black/0 bg-gradient-to-t p-3 lg:row-start-1 sm:row-start-2 sm:bg-none sm:p-0"
            >
              <h1 class="mt-1 text-lg text-white font-semibold lg:text-6xl md:text-2xl sm:text-slate-900 dark:sm:text-white">
                Des destinations qui pourraient vous plaire
              </h1>
            </div>
            <div
              class="grid col-start-1 row-start-1 col-end-3 gap-4 lg:row-span-6 lg:col-start-2 lg:row-end-6 sm:grid-cols-4 lg:mb-0 sm:mb-6 lg:gap-6"
            >
              <img
                src="https://images.unsplash.com/photo-1551634979-2b11f8c946fe?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="" class="h-60 w-full rounded-sm object-cover object-center lg:col-span-full sm:col-span-2 sm:h-52"
                loading="lazy"
              >
              <img
                src="https://images.unsplash.com/photo-1500380804539-4e1e8c1e7118?auto=format&fit=crop&q=80&w=900&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                class="hidden h-52 w-full rounded-sm object-cover lg:col-span-2 md:col-span-1 sm:col-span-2 lg:row-start-2 sm:block lg:h-32"
                loading="lazy"
              >
              <img
                src="https://images.unsplash.com/photo-1605641532626-5ab1dab56350?auto=format&fit=crop&q=80&w=900&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="" class="hidden h-52 w-full rounded-sm object-cover lg:col-span-2 lg:row-start-2 md:block lg:h-32"
                loading="lazy"
              >
            </div>
            <dl
              class="row-start-2 mt-2 flex items-center text-sm font-medium lg:row-start-2 sm:row-start-3 md:mt-1 sm:mt-1"
            >
              <dt class="sr-only">
                Reviews
              </dt>
              <dd class="mr-3 flex items-center text-blue-600 dark:text-blue-200">
                <span i-carbon-star-filled />
                <span>4.89 <span class="text-slate-400 font-normal">(128)</span></span>
              </dd>
              <dt class="sr-only">
                Location
              </dt>
              <dd class="flex items-center text-black dark:text-white">
                <span i-carbon-location-filled />
                Paris, Royaume-Uni, Emirats Arabes Unis, Thaïlande ...
              </dd>
            </dl>
            <div
              class="col-start-1 row-start-3 mt-4 self-center sm:row-span-2 lg:col-start-1 lg:row-start-3 sm:col-start-2 sm:row-start-2 lg:row-end-4 lg:mt-6 sm:mt-0"
            >
              <a-button type="primary" html-type="submit" class="group">
                Check availability
                <span
                  h-full w-full flex items-center justify-center rounded-r-2px
                  class="ml-2 bg-blue-9/20 px-2 -mr-[calc(1rem-1px)]"
                >
                  <span class="transition-all group-hover:translate-x-15%" i-carbon-arrow-right />
                </span>
              </a-button>
            </div>
          </div>
        </main>
      </div>
    </section>
    <section relative overflow-hidden shadow-inner>
      <div
        class="absolute right-0 top-0 h-full w-full bg-[url(https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?auto=format&fit=crop&q=80&w=900&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover bg-fixed opacity-90"
      />
      <div class="mx-auto py-34 container md:max-w-2xl">
        <UseElementVisibility v-slot="{ isVisible }">
          <div :class="[isVisible ? 'animate__animated animate__fadeInUp opacity-100' : 'opacity-0']" class="border-1px border-zinc-1/20 rounded-2px bg-zinc-1/40 px-4 py-8 backdrop-blur dark:bg-zinc-9/40 dark:text-slate-1">
            <h3
              class="my-1 mb-7 flex items-center gap-4 font-light after:h-px before:h-px after:flex-1 before:flex-1 after:bg-zinc-3/20 before:bg-zinc-3/20 md:text-5xl after:content-[''] before:content-['']"
            >
              Économisez 25%
            </h3>
            <div class="mb-4 text-sm md:text-lg">
              <h4 class="font-semibold md:text-xl">
                sur les séjours de 2 nuits minimum entre le 15 décembre 2023 et 3 mars 2024
              </h4>
            </div>
            <a-button type="primary" html-type="submit" class="group">
              Réservez avant le 16 novembre 2023
              <span
                h-full w-full flex items-center justify-center rounded-r-2px
                class="ml-2 bg-blue-9/20 px-2 -mr-[calc(1rem-1px)]"
              >
                <span class="transition-all group-hover:translate-x-15%" i-carbon-arrow-right />
              </span>
            </a-button>
          </div>
        </UseElementVisibility>
      </div>
    </section>
    <section>
      <div relative mb--10.25 h-180 flex items-center>
        <div relative z-1 mx-auto max-w-5xl px-4 text-center container>
          <div
            class="relative inline-block border border-zinc-4/20 bg-zinc-9/1 px-6 py-4 backdrop-blur backdrop-filter dark:bg-zinc-1/1"
          >
            <div
              class="absolute inset-0 h-full w-full bg-cover bg-fixed bg-center bg-no-repeat opacity-5 grayscale"
            />
            <button
              class="absolute left--6 top--6 z-2 block h-10 w-10 flex content-center justify-center border border-blue-8/20 bg-blue-6/90 backdrop-blur transition-all active:(border-blue-8 bg-blue-7/80) hover:bg-blue-7/90"
            >
              <span i-carbon-ibm-watson-machine-learning m-auto block text-sm text-white leading-8 class="icon-shadow" />
            </button>
            <h2
              class="inline from-slate-7 to-purple-4 bg-gradient-to-r bg-clip-text fill-transparent text-2xl/10 font-extrabold capitalize dark:from-blue-1 dark:to-purple-3 md:text-5xl/20"
              style="-webkit-text-fill-color: transparent;"
            >
              Gagnez des points et accédez à des avantages
              <span font-thin underline-solid>
                exclusifs
              </span>
            </h2>
          </div>
        </div>
        <div
          class="pointer-events-none absolute right-0 top-0 h-full w-full bg-[url(https://images.unsplash.com/photo-1470016342826-876ea880d0be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80)] bg-black bg-cover bg-top-center opacity-85 mix-blend-multiply dark:rotate-180 dark:bg-[url(https://images.unsplash.com/photo-1485673634125-0f3ae8fd3209?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80)] dark:mix-blend-lighten"
        />
      </div>
    </section>
  </div>
</template>
