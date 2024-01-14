<script setup lang="ts">
import { UseImage, vIntersectionObserver } from '@vueuse/components'

definePageMeta({
  layout: 'main',
})

const wrapperRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const { isScrolling, directions } = useScroll(wrapperRef)

const lastScrollDirection = ref<'up' | 'down'>('down')
watch(isScrolling, (val) => {
  if (val) {
    if (directions.top)
      lastScrollDirection.value = 'up'

    else if (directions.bottom)
      lastScrollDirection.value = 'down'
  }
})
const items = Array.from({ length: 156 }, (_, i) => ({
  index: i,
  id: i,
  title: `Event ${i}`,
  color: '#0f766e',
}))
// group by 7
const groupedItems = computed(() => chunks(items, 7))

function chunks<T>(arr: T[], size: number) {
  return arr.reduce((acc, _, i) => {
    if (i % size === 0)
      acc.push(arr.slice(i, i + size))
    return acc
  }, [] as T[][])
}

function onIntersectionObserver([{ isIntersecting, target }]: IntersectionObserverEntry[]) {
  // add class in-viewport if isIntersecting
  if (isScrolling.value)
    isIntersecting ? target.classList.add('in-viewport') : target.classList.remove('in-viewport')
}
</script>

<template>
  <div class="h-full flex">
    <div class="h-full w-full flex border-white/25 rounded-2px bg-white/50 dark:border-black/35 dark:bg-black/50">
      <main ref="wrapperRef" :class="[`dir-${lastScrollDirection}`]" class="w-full flex flex-1 flex-col overflow-hidden overflow-y-auto bg-light/25 dark:bg-dark/35">
        <!-- bg shadow -->
        <div class="pointer-events-none absolute inset-x-0 top-0 z-2 flex justify-center overflow-hidden">
          <div class="w-[108rem] flex flex-none justify-end opacity-25">
            <picture>
              <source
                srcset="https://tailwindcss.com/_next/static/media/docs@30.8b9a76a2.avif"
                type="image/avif"
              ><img
                src="https://tailwindcss.com/_next/static/media/docs@tinypng.d9e4dcdc.png" alt=""
                class="max-w-none w-[71.75rem] flex-none dark:hidden" decoding="async"
              >
            </picture>
            <picture>
              <source
                srcset="https://tailwindcss.com/_next/static/media/docs-dark@30.1a9f8cbf.avif"
                type="image/avif"
              ><img
                src="https://tailwindcss.com/_next/static/media/docs-dark@tinypng.1bbe175e.png" alt=""
                class="hidden max-w-none w-[90rem] flex-none dark:block" decoding="async"
              >
            </picture>
          </div>
        </div>
        <div
          class="pointer-events-none absolute inset-x-0 top-0 z-0 flex justify-center overflow-hidden opacity-45"
        >
          <div class="min-w-60rem w-100% flex flex-none justify-end">
            <picture class="">
              <source
                srcset="
          https://tailwindcss.com/_next/static/media/docs@30.8b9a76a2.avif
        " type="image/avif" class="" style="
"
              >
              <img
                src="https://tailwindcss.com/_next/static/media/docs@tinypng.d9e4dcdc.png" alt=""
                class="max-w-none w-[71.75rem] flex-none dark:hidden" decoding="async"
              >
            </picture>
            <picture>
              <source
                srcset="
          https://tailwindcss.com/_next/static/media/docs-dark@30.1a9f8cbf.avif
        " type="image/avif"
              >
              <img
                src="https://tailwindcss.com/_next/static/media/docs-dark@tinypng.1bbe175e.png" alt=""
                class="hidden max-w-none w-[90rem] flex-none dark:block" decoding="async"
              >
            </picture>
          </div>
        </div>
        <!-- header -->
        <div
          class="sticky top-0 z-9 border-b border-white/20 bg-white/65 backdrop-blur-sm dark:border-black/85 dark:bg-black/65"
        >
          <div class="flex flex-row items-center p-2">
            <div class="inline-flex flex-1 items-center">
              <div>
                <h2 class="inline-block text-xl/8 font-medium font-semibold tracking-wide">
                  Office Chat {{ lastScrollDirection }}
                </h2>
                <p class="text-xs text-gray-7 dark:text-gray-3">
                  Online 3 min ago
                </p>
              </div>
            </div>
            <div class="flex-0 flex space-x-2">
              <div>
                <div class="flex items-center -space-x-4 rtl:space-x-reverse">
                  <img
                    class="border border-light-5 rounded-full border-solid size-8 dark:border-dark-5"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt=""
                  >
                  <img
                    class="border border-light-5 rounded-full border-solid size-8 dark:border-dark-5"
                    src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt=""
                  >
                  <img
                    class="border border-light-5 rounded-full border-solid size-8 dark:border-dark-5"
                    src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" alt=""
                  >
                  <img
                    class="border border-light-5 rounded-full border-solid size-8 dark:border-dark-5"
                    src="https://flowbite.com/docs/images/people/profile-picture-4.jpg" alt=""
                  >
                </div>
              </div>
              <a-button type="text" shape="circle">
                <span class="i-carbon-search" />
              </a-button>
              <a-button type="text" shape="circle">
                <span class="i-carbon-phone" />
              </a-button>
              <a-button type="text" shape="circle">
                <span class="i-carbon-open-panel-right" />
              </a-button>
              <a-button type="text" shape="circle">
                <span class="i-carbon-overflow-menu-vertical" />
              </a-button>
            </div>
          </div>
        </div>
        <!-- content -->
        <div ref="contentRef" class="content flex-1 p-2 space-y-2">
          <div
            v-for="(group, index) in groupedItems" :key="index"
            class="grid grid-cols-4 grid-rows-3 h-[calc(100vh-7.75rem)] gap-2 lg:h-[calc(100vh-7.5rem)]"
          >
            <div
              v-for="(item, i) in group" :key="item.id"
              v-intersection-observer="[onIntersectionObserver, { root: contentRef, rootMargin: '0px' }]"
              class="card group" :tabindex="item.index"
              :class="[i === 0 ? 'col-span-4 row-span-1 xl:row-span-3 xl:col-span-1' : (i === 1 ? 'col-span-2 row-span-1 xl:row-span-3 xl:col-span-1' : (i === 6 && 'col-span-2 row-span-1 xl:row-span-1' || 'col-span-1 row-span-1 xl:row-span-1'))]"
            >
              <div class="h-full w-full">
                <UseImage
                  class="h-full w-full"
                  :src="`https://picsum.photos/${item.index + 800}/${item.index + 800}`"
                >
                  <template #default>
                    <div class="h-full w-full scale-120 bg-cover bg-cover bg-center bg-center transition-all duration-300 group-focus:(scale-100 opacity-80) group-hover:(scale-100 opacity-80)" :style="{ backgroundImage: `url(https://picsum.photos/${item.index + 800}/${item.index + 800})` }" />
                  </template>

                  <template #loading>
                    <span class="h-full w-full flex items-center justify-center">
                      <a-spin
                        class="[&_.arco-spin-icon]:(h-full w-full flex items-center justify-center text-4)"
                      />
                    </span>
                  </template>

                  <template #error>
                    <span class="h-full w-full flex items-center justify-center">
                      Failed
                    </span>
                  </template>
                </UseImage>
                <div
                  class="absolute w-full translate-y-[100%] from-black to-black/0 bg-gradient-to-t p-3 py-4 text-white transition-all-400 group-focus:-translate-y-[100%] group-hover:-translate-y-[100%]"
                >
                  <h3 class="text-lg font-bold">
                    Lorem ipsum dolor.
                  </h3>
                  <p>Lorem ipsum dolor sit amet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped lang="less">
// .dir-up {
//     .card {
//         &.in-viewport:not(.animated) {
//             @apply animated-fade-in-up;
//         }
//     }
// }
// .dir-down {
//     .card {
//         &.in-viewport:not(.animated) {
//             @apply animated-fade-in-up;
//         }
//     }
// }
.card {
    @apply group relative w-full cursor-pointer overflow-hidden rounded-2px border-2px dark:border-dark/70 border-light/70 bg-light/95 dark:bg-dark/95;

    @apply transition-all;
    // @apply duration-200 opacity-0 invisible pointer-events-none;
    &.in-viewport {
        @apply visible pointer-events-auto;
        @apply animated;

        &:nth-child(1) {
            @apply animated-delay-100;
        }
        &:nth-child(2) {
            @apply animated-delay-150;
        }
        &:nth-child(3) {
            @apply animated-delay-200;
        }
        &:nth-child(4) {
            @apply animated-delay-250;
        }
        &:nth-child(5) {
            @apply animated-delay-300;
        }
        &:nth-child(6) {
            @apply animated-delay-400;
        }
        &:nth-child(7) {
            @apply animated-delay-45;
        }
        &>div {
        }
        // animation: fadeInUp 2s linear forwards;

        // animation-range-start: cover 0%;
        // animation-range-end: contain 0%;
        // animation-timeline: view();

        // &:nth-child(2) {
        //     animation: rollInPlus 2s linear forwards;

        //     animation-range-start: cover 0%;
        //     animation-range-end: contain 0%;
        //     animation-timeline: scroll();
        // }

        // &:nth-child(4) {
        //     animation: fadeInUp 4s linear forwards;

        //     animation-range-start: cover 0%;
        //     animation-range-end: contain 0%;
        //     animation-timeline: scroll();
        // }

        // &:nth-child(7) {
        //     animation: rollIn 6s linear forwards;

        //     animation-range-start: cover 0%;
        //     animation-range-end: contain 0%;
        //     animation-timeline: scroll();
        // }
    }
}

@keyframes rollIn {
    from {
        opacity: 0;
        transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);
    }

    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}

@keyframes rollInPlus {
    from {
        opacity: 0;
        transform: translate3d(+100%, 0, 0) rotate3d(0, 0, 1, +120deg);
    }

    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translate3d(0, 200px, 0);
    }

    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}
</style>
