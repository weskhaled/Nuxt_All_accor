<script setup lang="ts">
import { sideHidden } from '~/common/stores/index'

const { loggedIn, user, session, clear } = useUserSession()

const color = useColorMode()
const route = useRoute()
const router = useRouter()
const { y: windowScrollY } = useWindowScroll()

const currentRoutePath = ref([route.path])
router.afterEach((value) => {
  currentRoutePath.value = [value.path]
})
useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#222222' : '#ffffff',
  }],
})

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'

  if (color.preference === 'light')
    document?.body.removeAttribute('arco-theme')

  else
    document?.body.setAttribute('arco-theme', 'dark')
}

onMounted(() => {
  if (color.preference === 'light')
    document?.body.removeAttribute('arco-theme')
  else
    document?.body.setAttribute('arco-theme', 'dark')
})

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
</script>

<template>
  <div
    class="mx-auto flex items-center justify-between border-b border-zinc-3/30 px-2 dark:border-zinc-6/30 lg:px-5 dark:text-light !transition-all"
    :class="[windowScrollY > 200 && 'container', windowScrollY > 200 ? 'xl:py-0' : 'xl:py-5']"
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
          mode="horizontal" :theme="color.value === 'dark' ? 'dark' : 'light'" :default-selected-keys="currentRoutePath"
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
                <span v-if="!loggedIn" class="i-carbon-user-avatar-filled mr-1 inline-block h-5 w-5 text-sm" />
                <template v-else>
                  <img
                    :src="user.google.picture"
                    :alt="user.google.name"
                    class="mr-1 inline-block h-5 w-5 rounded-full text-sm"
                  >
                </template>
                <span class="hidden capitalize sm:inline-block">
                  {{ loggedIn ? user.google.name : 'Se connecter' }}
                </span>
                <span class="i-carbon-chevron-down ml-0.75 inline-block h-3 w-3 text-sm leading-30px" />
              </span>
            </a-button>
            <template #content>
              <a-doption @click="$router.push('/calendar')">
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
              <a-doption v-if="!loggedIn" @click="async () => await router.push('/auth')">
                <template #icon>
                  <span class="text-md i-carbon-login inline-block h-5 w-5 leading-30px" />
                </template>
                <template #default>
                  Se connecter
                </template>
              </a-doption>
              <a-doption v-else @click="clear()">
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
