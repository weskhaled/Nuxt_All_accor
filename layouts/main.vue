<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'
import { UseDraggable as Draggable } from '@vueuse/components'
import { mdAndSmaller } from '~/common/stores/index'

const route = useRoute()
const router = useRouter()
const { isDark, toggleDark } = useDark()
const supabaseClient = useSupabaseClient()
const user = useSupabaseUser()
const currentRoutePath = ref([route.path])
// const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
const { width: windowWidth, height: windowHeight } = useWindowSize()
const breakpoints = useBreakpoints(breakpointsTailwind)
const greaterOrEqualToMd = computed(() => breakpoints.greaterOrEqual('md'))
const [showSidebarValue, showSidebarToggle] = useToggle()
const popupFloatMenuVisible = ref(false)

const handlePopupFloatMenu = ref<HTMLElement | null>(null)
const layoutSiderRef = ref<HTMLElement | null>(null)
const layoutMobileMenuRef = ref<HTMLElement | null>(null)

watch(user, (value) => {
  if (!value)
    return router.push('/auth')
})

router.afterEach((to) => {
  currentRoutePath.value = [to.path]
  showSidebarValue.value = false
})

onClickOutside(layoutSiderRef, () => {
  showSidebarValue.value = false
}, {
  ignore: [layoutMobileMenuRef],
})
</script>

<template>
  <a-layout
    class="wrapper-layout relative h-[calc(100vh-2.25rem)] min-h-screen flex font-sans !flex-row"
    :class="[(mdAndSmaller && showSidebarValue) && 'has-sidebar']"
  >
    <ClientOnly>
      <a-layout-sider
        ref="layoutSiderRef" hide-trigger collapsible :collapsed-width="60"
        :theme="isDark ? 'dark' : 'light'" :collapsed="greaterOrEqualToMd.value === true" class="layout-sidebar"
        :class="[showSidebarValue ? 'lt-md:translate-x-0' : 'lt-md:translate-x-[-100%]']"
      >
        <a href="" class="relative my-3 flex" @click.prevent="async () => await $router.push('/')">
          <span class="flex items-center">
            <svg
              class="fill-current text-black dark:text-white" aria-hidden="true" focusable="false" width="45"
              height="35" viewBox="0 0 76 46"
            >
              <svg id="all" fill="none" viewBox="0 0 76 46" xmlns="http://www.w3.org/2000/svg">
                <g fill="currentColor">
                  <path
                    d="M42.782 45.148H32.42L24.8 28.903c-2.333 1.246-4.104 3.407-5.954 5.663-1.448 1.765-2.943 3.588-4.793 5.078-2.153 1.733-4.656 3.267-7.784 4.314-1.417.47-3.828 1.084-4.73 1.174-.386.036-.644.018-.7-.108-.036-.109.056-.181.46-.38l.37-.166c.743-.328 2.2-.971 3.183-1.639 1.49-1.029 2.337-2.13 2.41-2.978-.075-.262-.237-.582-.432-.969-.855-1.695-2.345-4.649.083-9.339.429-.834.834-1.572 1.208-2.254.557-1.014 1.046-1.904 1.442-2.8.754-1.715 1.306-4.134 1.49-5.94.019-.108.037-.108.092-.035 1.454 1.444 7.086 7.112 6.258 12.762 1.877-.704 5.116-2.852 6.606-3.99.35-.267.674-.536.983-.794 1.088-.907 2.001-1.668 3.305-1.696.838-.01 1.246.207 1.654.426.319.17.638.34 1.162.404.294.036.736-.018.957-.126.092-.037.074-.145-.074-.18-.674-.159-1.137-.476-1.6-.792-.65-.445-1.297-.888-2.522-.888-1.412 0-2.616.96-3.588 1.736-.32.256-.615.49-.884.665l-5.319-10.867c-2.208-4.549-1.545-7.852 3.35-14.351l21.348 44.315zM59.693 45.166h-6.422c-2.706 0-4.086-.587-5.08-1.889-1.067-1.376-1.067-3.485-1.067-5.466V.851h8.281v38.152c0 3.027.332 5.173 4.288 6.035v.128zM69.077 45.166H75.5v-.128c-3.957-.862-4.288-3.008-4.288-6.035V.851H62.93v36.96c0 1.981 0 4.09 1.068 5.466.994 1.302 2.374 1.89 5.08 1.89z"
                  />
                </g>
              </svg>
            </svg>
          </span>
        </a>
        <div class="h-full max-h-full w-full flex flex-1 justify-center overflow-hidden overflow-y-auto md:mb-2">
          <a-menu
            :default-selected-keys="currentRoutePath" :selected-keys="currentRoutePath"
            class="[&_.arco-icon]:h-1.25em [&_.arco-icon]:w-1.25em [&_.arco-menu-inner]:h-auto"
          >
            <a-menu-item key="/" @click="async () => await $router.push('/')">
              <span class="i-carbon-home arco-icon mx-0 inline-block text-sm" />
              Séjours
            </a-menu-item>
            <a-menu-item key="/search" @click="async () => await $router.push('/search')">
              <span class="arco-icon i-carbon-search mx-0 inline-block text-sm" />
              Recherche
            </a-menu-item>
            <a-menu-item key="/user/calendar" @click="async () => await $router.push('/user/calendar')">
              <span class="arco-icon i-carbon-calendar-heat-map mx-0 inline-block text-sm" />
              Activités
            </a-menu-item>
            <a-menu-item key="/user/chat" @click="async () => await $router.push('/user/chat')">
              <span class="arco-icon i-carbon-chat mx-0 inline-block text-sm" />
              Réunions & Evenements
            </a-menu-item>
            <a-menu-item key="/gallery" @click="$router.push('/gallery')">
              <span class="arco-icon i-carbon-plane-private mx-0 inline-block text-sm" />
              Professionnels
            </a-menu-item>
            <a-sub-menu key="6">
              <template #title>
                <span>
                  <span class="arco-icon i-carbon-train-speed mx-0 inline-block text-sm" />
                  Taxis et VTC
                </span>
              </template>
              <a-menu-item key="6_1">
                Menu 1
              </a-menu-item>
              <a-menu-item key="6_2">
                Menu 2
              </a-menu-item>
              <a-sub-menu key="6_3" title="Navigation 2">
                <a-menu-item key="6_3_1">
                  Menu 1
                </a-menu-item>
                <a-menu-item key="6_3_2">
                  Menu 2
                </a-menu-item>
              </a-sub-menu>
              <a-sub-menu key="6_4" title="Navigation 3">
                <a-menu-item key="6_4_1">
                  Menu 1
                </a-menu-item>
                <a-menu-item key="6_4_2">
                  Menu 2
                </a-menu-item>
                <a-menu-item key="6_4_3">
                  Menu 3
                </a-menu-item>
              </a-sub-menu>
            </a-sub-menu>
          </a-menu>
        </div>
        <div
          class="flex-0 flex items-center lt-md:(w-full justify-center border-t border-light-1 bg-light-1/80 py-4 space-x-4 dark:border-dark-6 dark:bg-dark-8/80) md:flex-col md:pb-8 [&_.arco-btn>.arco-btn-icon>span]:text-dark md:space-y-4 dark:[&_.arco-btn>.arco-btn-icon>span]:text-light"
        >
          <a-dropdown v-if="user">
            <a-button shape="circle" class="h-full flex items-center justify-center" type="text">
              <img
                :src="user.user_metadata?.avatar_url" :alt="user.user_metadata?.full_name"
                class="block h-full w-full rounded-full"
              >
            </a-button>
            <template #content>
              <a-doption @click="async () => await router.push('/user/profile')">
                <template #icon>
                  <span class="i-iconoir-user-square" />
                </template>
                <template #default>
                  Profile
                </template>
              </a-doption>
              <a-doption @click="async () => await supabaseClient.auth.signOut()">
                <template #icon>
                  <span class="i-iconoir-log-out" />
                </template>
                <template #default>
                  Logout
                </template>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip v-else content="Mon compte et mes points" position="tr" mini>
            <a-button
              shape="circle" class="h-full flex items-center justify-center" type="text"
              @click="async () => await $router.push('/auth')"
            >
              <span class="i-carbon-user-avatar block h-6 w-6" />
            </a-button>
          </a-tooltip>
          <a-tooltip content="Notifications" position="tr" mini>
            <a-badge :count="99">
              <a-button shape="circle" class="" type="text">
                <template #icon>
                  <span class="i-carbon-notification block h-5 w-5 text-sm" />
                </template>
              </a-button>
            </a-badge>
          </a-tooltip>
          <a-tooltip content="Setting" position="tr" mini>
            <a-button shape="circle" class="" type="text">
              <template #icon>
                <span class="i-carbon-settings block h-5 w-5 text-sm" />
              </template>
            </a-button>
          </a-tooltip>
          <a-tooltip content="Toggle Dark mode" position="tr" mini>
            <a-button shape="circle" class="" type="text" @click="toggleDark()">
              <template #icon>
                <span class="i-carbon-sun dark:i-carbon-moon block h-5 w-5 text-sm" />
              </template>
            </a-button>
          </a-tooltip>
        </div>
      </a-layout-sider>
    </ClientOnly>
    <a-layout class="ml-0 flex flex-col transition-margin">
      <a-layout-content id="layoutMain" class="relative overflow-hidden">
        <Suspense>
          <!-- loading state via #fallback slot -->
          <slot />
          <template #fallback>
            <div
              class="top-0 h-full flex items-center justify-center bg-light-1/90 backdrop-blur backdrop-filter dark:bg-dark-9/90"
            >
              <a-spin />
            </div>
          </template>
        </Suspense>
      </a-layout-content>
      <LayoutFooter class="flex-0" />
      <ClientOnly>
        <div ref="layoutMobileMenuRef" class="bottom-0 z-999 w-full px-0 md:hidden">
          <div
            class="relative z-15 mx-auto w-auto flex items-center border border-slate-2/55 rounded-0 bg-slate-1/85 py-1 text-slate-500 backdrop-blur backdrop-filter dark:border-slate-9/55 dark:bg-black/85 dark:text-slate-200"
          >
            <div class="flex flex-auto items-center justify-evenly">
              <a-button
                shape="circle" class="block !h-9 !w-9" type="text"
                @click="async () => user ? await router.push('/user/profile') : await router.push('/auth')"
              >
                <span v-if="!user" class="i-carbon-user-avatar block h-6 w-6" />
                <template v-else>
                  <img
                    :src="user.user_metadata?.avatar_url" :alt="user.user_metadata?.full_name"
                    class="block h-6 w-6 rounded-full"
                  >
                </template>
              </a-button>
              <a-button
                shape="circle" class="block !h-9 !w-9" type="text" aria-label="Previous"
                @click="async () => router.back()"
              >
                <template #icon>
                  <span i-carbon-undo class="" />
                </template>
              </a-button>
            </div>
            <a-button
              long
              class="mx-auto mb-0 flex flex-none items-center justify-center rounded-full shadow-sm ring-1 ring-slate-900/5 -my-3 !h-12 !w-12 dark:text-slate-1"
              type="primary" shape="circle" @click="async () => await $router.push('/')"
            >
              <span i-carbon-home class="text-2xl" />
            </a-button>
            <div class="flex flex-auto items-center justify-evenly">
              <a-button shape="circle" class="block xl:block !h-9 !w-9" type="text" aria-label="Next">
                <template #icon>
                  <span i-carbon-redo class="" />
                </template>
              </a-button>
              <a-tooltip content="Toggle Menu" position="tr" mini>
                <a-button shape="circle" class="block !h-9 !w-9" type="text" @click="() => showSidebarToggle()">
                  <template #icon>
                    <span v-if="showSidebarValue" class="i-carbon-side-panel-close-filled block h-5 w-5 text-sm" />
                    <span v-else class="i-carbon-side-panel-open-filled block h-5 w-5 text-sm" />
                  </template>
                </a-button>
              </a-tooltip>
            </div>
          </div>
        </div>
      </ClientOnly>
    </a-layout>
    <ClientOnly>
      <Draggable
        storage-key="vueuse-draggable" storage-type="session" class="fixed z-1001"
        :initial-value="{ x: windowWidth - 150, y: windowHeight - 150 }" :prevent-default="true"
      >
        <div ref="handlePopupFloatMenu">
          <span
            class="absolute left--5px top--5px z-102 h-5 w-5 flex cursor-grab items-center justify-center rounded-full bg-blue-700 text-10px text-light-50 active:cursor-grabbing"
          >
            <IconDragArrow />
          </span>
        </div>
        <a-trigger
          v-model:popupFloatMenuVisible="popupFloatMenuVisible" :trigger="[mdAndSmaller ? 'click' : 'hover']"
          position="top" class="cursor-grab !dark:[&_.arco-menu-item]:bg-dark-9"
        >
          <div :class="`button-trigger ${popupFloatMenuVisible ? 'button-trigger-active' : ''}`">
            <span v-if="popupFloatMenuVisible" i-carbon-close />
            <span v-else i-carbon-overflow-menu-vertical />
          </div>
          <template #content>
            <a-menu
              :style="{ marginBottom: '-2px' }" mode="popButton" :tooltip-props="{ mini: true, position: 'left' }"
              show-collapse-button
            >
              <a-menu-item key="1">
                <template #icon>
                  <IconBug />
                </template>
                Bugs
              </a-menu-item>
              <a-menu-item key="2">
                <template #icon>
                  <IconBulb />
                </template>
                Ideas
              </a-menu-item>
            </a-menu>
          </template>
        </a-trigger>
      </Draggable>
    </ClientOnly>
  </a-layout>
</template>

<style lang="less">
.layout-sidebar {
  @apply border-r-1px border-stone-2 z-20 md:block dark:border-stone-9 transition-all !lt-md:h-[calc(100%-2.9rem)];

  @apply bg-white/85 dark:bg-black/85;

  .arco-menu {
    @apply !bg-transparent;
  }

  .arco-layout-sider-children {
    @apply flex flex-col items-center justify-between;
  }

  @apply lt-md:(absolute z-20 h-full top-0 left-0 !w-[calc(20rem)] !dark:bg-dark-9 bg-light-9);
}

.arco-menu-item.arco-menu-selected {
  @apply !text-white !bg-[#00aaff]/90;

  & .arco-icon {
    @apply !text-white;
  }
}

.button-trigger {
  @apply absolute cursor-pointer rounded-full z-101 items-center justify-center fixed text-sm flex h-40px w-40px text-zinc-100 bg-blue-600 shadow-md;
  transition: all 0.1s;
}

.wrapper-layout {
  .arco-layout-content {

    &::before {
      @apply pointer-events-none absolute right-0 top-0 z-10 h-full w-full bg-black/0 transition-all content-[''];
    }
  }

  &.has-sidebar {
    .arco-layout-content {

      &::before {
        @apply bg-black/90 pointer-events-auto;
      }
    }
  }
}
</style>
