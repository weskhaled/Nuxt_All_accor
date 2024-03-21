<script setup lang="ts">
import { sideHidden } from '~/common/stores/index'

const supabaseClient = useSupabaseClient()
const user = useSupabaseUser()

const { isDark, toggleDark } = useDark()
const route = useRoute()
const router = useRouter()

const currentRoutePath = ref([route.path])
router.afterEach((value) => {
  currentRoutePath.value = [value.path]
})

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
</script>

<template>
  <div
    class="mx-auto flex items-center justify-between px-2 dark:border-zinc-6/30 lg:px-5 dark:text-light !transition-all"
  >
    <div class="w-0 flex grow-0 items-center transition-width duration-300 md:w-35 sm:w-35">
      <div class="ml--2 hidden h-full w-9 items-center justify-center md:w-12">
        <a-button type="text" @click="() => (sideHidden = false)">
          <template #icon>
            <span class="i-line-md-menu-fold-right" />
          </template>
        </a-button>
      </div>
      <a href="" class="relative hidden sm:flex" @click.prevent="async () => await $router.push('/')">
        <span class="flex items-center">
          <svg class="fill-current text-black dark:text-white" aria-hidden="true" focusable="false" width="60" height="35" viewBox="0 0 76 46">
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
          </svg>
        </span>
      </a>
    </div>
    <div class="header-menu [--primary-6:var(--gray-9)] flex grow-1 justify-end md:justify-between">
      <div class="flex-1 overflow-hidden border-zinc-4/20 sm:border-l ![&_.arco-menu]:bg-transparent">
        <a-menu
          v-model:selected-keys="currentRoutePath"
          tabindex="2"
          :trigger-props="{
            contentClass: 'header-menu-nav',
          }"
          class="max-w-4xl w-full ![&_.arco-menu-item:not(:hover)]:bg-transparent ![&>.arco-menu-inner]:pl-0 !dark:[&_.arco-menu-item]:text-light"
          mode="horizontal" :theme="isDark ? 'dark' : 'light'" :default-selected-keys="currentRoutePath"
        >
          <a-menu-item key="/" @click="async () => await $router.push('/')">
            Séjours
          </a-menu-item>
          <a-menu-item key="/programme" @click="async () => await $router.push('/')">
            Programme de fidélité
          </a-menu-item>
          <a-menu-item key="/plans" @click="async () => await $router.push('/')">
            Bons plans
          </a-menu-item>
          <a-menu-item key="/restau" @click="async () => await $router.push('/')">
            Restaurants
          </a-menu-item>
          <a-menu-item key="/spa" @click="async () => await $router.push('/')">
            Spa
          </a-menu-item>
          <a-menu-item key="/cartes" @click="async () => await $router.push('/')">
            Cartes de paiement
          </a-menu-item>
          <a-menu-item key="/partenaires" @click="async () => await $router.push('/')">
            Nos partenaires
          </a-menu-item>
          <a-menu-item key="/paris_2024" @click="async () => await $router.push('/')">
            Paris 2024
          </a-menu-item>
          <a-menu-item key="/taxis" @click="async () => await $router.push('/')">
            Taxis et VTC
          </a-menu-item>
          <a-menu-item key="/activites" @click="async () => await $router.push('/')">
            Activités
          </a-menu-item>
          <a-menu-item key="/events" @click="async () => await $router.push('/')">
            Réunions & Evenements
          </a-menu-item>
          <a-menu-item key="/professionnels" @click="async () => await $router.push('/')">
            Professionnels
          </a-menu-item>
        </a-menu>
      </div>
      <div class="flex items-center space-x-1">
        <div class="hidden md:flex">
          <a-button shape="circle" class="mr-1" type="text" @click.stop="async () => await toggleFullscreen()">
            <template #icon>
              <span :class="[isFullscreen ? 'i-carbon-minimize' : 'i-carbon-center-to-fit']" />
            </template>
          </a-button>
          <div class="hidden items-center border-x border-zinc-4/20 px-2 md:flex">
            <a-badge :count="9" dot :offset="[-22, 5]" class="[&>.arco-badge-custom-dot]:overflow-visible">
              <template #content>
                <span
                  class="pointer-events-none relative block h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_0_1px_var(--color-bg-2)]"
                >
                  <span
                    class="absolute left--0.25 top--0.25 block h-2 w-2 inline-flex animate-ping rounded-full bg-green-400 opacity-75"
                  />
                </span>
              </template>
              <a-trigger
                trigger="click" show-arrow
                :scroll-to-close="true"
                class="[&_.arco-trigger-arrow]:bg-zinc-4/20"
              >
                <a-button shape="circle" class="" size="medium" type="text">
                  <template #icon>
                    <span i-carbon-earth-filled class="" />
                  </template>
                </a-button>
                <template #content>
                  <div class="min-w-75 border-1px border-zinc-4/20 rounded-2px bg-white shadow dark:bg-dark-9">
                    <div flex items-center justify-between p-2 class="border-b border-zinc-4/20 bg-zinc-4/5">
                      <h3 class="text-3.2 dark:text-light">
                        Notifications
                      </h3>
                      <a-button class="text-3" size="mini" type="text">
                        Read All
                      </a-button>
                    </div>
                    <div class="relative min-h-45 flex overflow-hidden overflow-y-scroll">
                      <a-empty class="flex flex-col justify-center" />
                    </div>
                  </div>
                </template>
              </a-trigger>
            </a-badge>
          </div>
        </div>
        <a-tooltip content="Toggle Dark mode" position="br" mini>
          <a-button shape="circle" class="px-2" type="text" @click="toggleDark()">
            <template #icon>
              <span class="i-carbon-sun dark:i-carbon-moon mx-1 block h-4 w-4 text-sm" />
            </template>
          </a-button>
        </a-tooltip>
        <div class="border-l-0 border-zinc-4/20 pl-1">
          <a-dropdown trigger="hover">
            <a-button class="!px-1.5" shape="round" status="success">
              <span class="flex items-center">
                <span v-if="!user" class="i-carbon-user-avatar-filled mr-1 inline-block h-5 w-5 text-sm" />
                <template v-else>
                  <img
                    :src="user.user_metadata?.avatar_url"
                    :alt="user.user_metadata?.full_name"
                    class="mr-1 inline-block h-5 w-5 rounded-full text-sm"
                  >
                </template>
                <span class="hidden capitalize sm:inline-block">
                  {{ user ? user.user_metadata?.name : 'Se connecter' }}
                </span>
                <span class="i-carbon-chevron-down ml-0.75 inline-block h-3 w-3 text-sm leading-30px" />
              </span>
            </a-button>
            <template #content>
              <a-doption @click="$router.push('/user/calendar')">
                <template #icon>
                  <span class="text-md i-carbon-calculation inline-block h-5 w-5 leading-30px" />
                </template>
                <template #default>
                  Mes réservations
                </template>
              </a-doption>
              <a-doption>
                <template #icon>
                  <span class="text-md i-carbon-virtual-column-key inline-block h-5 w-5 leading-30px" />
                </template>
                <template #default>
                  Avantages et statut
                </template>
              </a-doption>
              <a-doption>
                <template #icon>
                  <span class="text-md i-carbon-favorite inline-block h-5 w-5 leading-30px" />
                </template>
                <template #default>
                  Mes favoris
                </template>
              </a-doption>
              <a-doption v-if="!user" @click="async () => await router.push('/auth')">
                <template #icon>
                  <span class="text-md i-carbon-login inline-block h-5 w-5 leading-30px" />
                </template>
                <template #default>
                  Se connecter
                </template>
              </a-doption>
              <a-doption v-else @click="async() => await supabaseClient.auth.signOut()">
                <template #icon>
                  <span class="text-md i-carbon-logout inline-block h-5 w-5 leading-30px" />
                </template>
                <template #default>
                  De connecter
                </template>
              </a-doption>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
header {

  .arco-btn-text,
  .arco-btn-text[type='button'],
  .arco-btn-text[type='submit'] {
    color: inherit !important;
  }
}
.header-menu-nav {
  & .arco-trigger-menu-item {
    @apply text-4 !dark:text-light-5;
  }
}
.header-menu {
  .arco-menu-item {
    @apply !text-3.8 !font-400;
  }
}
// :deep(.arco-menu-horizontal .arco-menu-inner) {
//   @apply !p-0;
// }
// .demo-arrow {
//   box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
//   padding: 10px;
//   width: 200px;
//   background-color: var(--color-bg-popup);
//   border-radius: 4px;
// }
</style>
