<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'
import { floatMenuItems, mdAndSmaller } from '~/common/stores/index'

const route = useRoute()
const router = useRouter()
const { isDark, toggleDark } = useDark()
const supabaseClient = useSupabaseClient()
const user = useSupabaseUser()
const currentRoutePath = computed(() => [route.path])
// const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
const breakpoints = useBreakpoints(breakpointsTailwind)
const greaterOrEqualToMd = computed(() => breakpoints.greaterOrEqual('md'))
const [showSidebarValue, showSidebarToggle] = useToggle()
const popupFloatMenuVisible = ref(false)

const layoutSiderRef = ref<HTMLElement | null>(null)
const layoutMobileMenuRef = ref<HTMLElement | null>(null)

watch(user, async (value) => {
  if (!value)
    return await router.push('/auth')
})

router.afterEach(() => {
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
        ref="layoutSiderRef" collapsible hide-trigger :collapsed-width="60"
        :theme="isDark ? 'dark' : 'light'" :collapsed="greaterOrEqualToMd.value === true" class="layout-sidebar"
        :class="[showSidebarValue ? 'lt-md:translate-x-0' : 'lt-md:translate-x-[-100%]']"
      >
        <a href="" class="relative my-3 flex" @click.prevent="async () => await $router.push('/')">
          <span class="flex items-center">
            <svg width="45" height="45" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M291.034 320.468V178.92H356.386V420H262.45L212.892 258.13L172.91 420H112.643L12 133H78.4664L146.737 319.091L184.308 165.831H243.542L291.034 320.468Z"
                fill="currentColor"
              />
              <path
                d="M290.788 92H357.013V197.083C368.571 192.492 381.132 189.974 394.264 189.974C451.412 189.974 497.738 237.654 497.738 296.469V420H431.515V296.469C431.515 275.296 414.837 258.13 394.264 258.13C373.699 258.13 357.026 275.279 357.013 296.44V420H290.788V92Z"
                fill="currentColor"
              />
              <path d="M435.262 188.112V92H499V188.112H435.262Z" fill="currentColor" />
            </svg>
          </span>
        </a>
        <div class="h-full max-h-full w-full flex flex-1 justify-center overflow-hidden overflow-y-auto md:mb-2">
          <a-menu
            :default-selected-keys="currentRoutePath" :selected-keys="currentRoutePath"
            class="[&_.arco-icon]:h-1.25em [&_.arco-icon]:w-1.25em [&_.arco-menu-inner]:h-auto"
          >
            <a-menu-item key="/" @click="async () => await $router.push('/')">
              <span class="arco-icon i-carbon-home mx-0 inline-block text-sm" />
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
          class="flex-0 flex items-center lt-md:(w-full justify-center border-t border-light-1 bg-light-1/80 py-3 space-x-2 dark:border-dark-6 dark:bg-dark-8/80) md:flex-col md:pb-8 [&_.arco-btn>.arco-btn-icon>span]:text-dark md:space-y-4 dark:[&_.arco-btn>.arco-btn-icon>span]:text-light"
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
      <a-layout-content id="layoutMain" class="relative perspective-1000px overflow-hidden">
        <Suspense>
          <!-- loading state via #fallback slot -->
          <div class="h-full w-full transition-all-0">
            <slot />
          </div>
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
      <CommonDraggableFloatMenu v-model="popupFloatMenuVisible" :menu-items="floatMenuItems" />
    </ClientOnly>
  </a-layout>
</template>

<style lang="less">
.layout-sidebar {
  @apply border-r-1px border-stone-2 z-20 md:block dark:border-stone-9 transition-all !lt-md:h-[calc(100%-2.875rem)];

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
    @apply transition-all;

    &::before {
      @apply pointer-events-none absolute right-0 top-0 z-120 h-full w-full bg-black/0 transition-all content-[''];
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
