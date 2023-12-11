<script setup lang="ts">
const { loggedIn, user, session, clear } = useUserSession()

definePageMeta({
  layout: 'auth',
})

const router = useRouter()
const { message } = useMessage()
const currentYear = useDateFormat(useNow(), 'YYYY')

const loginLoading = ref(false)
const loginFormRef = ref()

const loginForm = reactive({
  username: 'weskhaled',
  password: 'Pa55w0rd',
  rememberMe: false,
})

onMounted(async () => {
  if (loggedIn.value) {
    const data = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList')
    console.log('list', data)
  }

  console.log('mounted', user.value?.google?.name)
  console.log('mounted', session.value)
})
</script>

<template>
  <!-- Example -->
  <div class="min-h-screen flex bg-white/70 dark:bg-dark-1/50">
    <!-- Container -->
    <div class="w-full flex flex-row">
      <!-- Sidebar -->
      <div class="hidden flex-col justify-between bg-blue-7 text-white lg:max-w-sm xl:max-w-1/2 lg:flex lg:p-8 xl:p-12">
        <a href="javascript:;" class="flex items-center justify-start space-x-3" @click.stop="async() => await router.push('/')">
          <span class="h-8 w-8 rounded-full bg-white" />
          <span class="text-3xl font-medium font-script">
            All.accor
          </span>
        </a>
        <div class="space-y-5">
          <h1 class="font-bold font-sans lg:text-3xl xl:text-5xl xl:leading-snug">
            Enter your account and discover new
            experiences
          </h1>
          <p class="text-lg">
            You do not have an account?
          </p>
          <a-button type="primary" size="large">
            Create account here
          </a-button>
        </div>
        <p class="font-medium">
          © {{ currentYear }} All with Love
        </p>
      </div>

      <!-- Login -->
      <div class="relative flex flex-1 flex-col items-center justify-center px-10">
        <div class="w-full flex items-center justify-between py-4 lg:hidden">
          <div class="flex items-center justify-start space-x-3">
            <a href="javascript:;" class="flex items-center justify-start space-x-3" @click.stop="async() => await router.push('/')">
              <span class="h-8 w-8 rounded-full bg-blue" />
              <span class="text-3xl font-medium font-script dark:text-light-50">
                All.accor
              </span>
            </a>
          </div>
          <div class="flex items-center space-x-2">
            <span class="hidden md:inline-block">Not a member? </span>
            <a href="#" class="text-[#070eff] font-medium underline">
              Sign up now
            </a>
          </div>
        </div>
        <!-- Login box -->
        <div class="max-w-md flex flex-1 flex-col justify-center space-y-5">
          <div class="flex flex-col text-center space-y-2">
            <h2 class="mt-8 text-4xl font-bold font-mono md:text-4xl">
              Sign in to account
            </h2>
          </div>
          <div class="max-w-md flex flex-col space-y-5">
            <a-form ref="loginFormRef" :model="loginForm" :style="{ width: '100%' }" layout="vertical">
              <a-form-item
                label="Username"
                field="username" :rules="[{ required: true, message: 'name is required' }, { minLength: 5, message: 'must be greater than 5 characters' }]"
                :validate-trigger="['change', 'input']"
              >
                <a-input
                  v-model="loginForm.username"
                  placeholder="please enter your username..."
                >
                  <template #prefix>
                    <i i-carbon-user block />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item
                label="Password"
                field="password" :rules="[{ required: true, message: 'name is required' }, { minLength: 4, message: 'must be greater than 4 characters' }]"
                :validate-trigger="['change', 'input']"
              >
                <a-input-password v-model="loginForm.password" placeholder="please enter your password">
                  <template #prefix>
                    <i i-carbon-password block />
                  </template>
                </a-input-password>
              </a-form-item>
              <a-form-item field="rememberMe">
                <a-checkbox v-model="loginForm.rememberMe">
                  Remember me
                </a-checkbox>
              </a-form-item>
              <a-form-item class="!mb-0">
                <a-button :loading="loginLoading" long type="primary" html-type="submit">
                  Login
                </a-button>
              </a-form-item>
            </a-form>
            <div class="flex items-center justify-center">
              <span class="w-full border-1px border-gray-200/30" />
              <span class="px-4">Or</span>
              <span class="w-full border-1px border-gray-200/30" />
            </div>
            <a-button shape="round" type="primary" html-type="submit" class="group overflow-hidden !h-12 !w-full !border-blue-9/50 !rounded-full !text-white" size="large" href="/api/auth/google" role="link">
              <span class="flex-1 text-4.5 font-500 font-mono">
                Sign in with Google
              </span>
              <span
                flex-0 h-full w-12 flex items-center justify-center rounded-full shadow-sm
                class="ml-2 bg-blue-6/30 px-0 -mr-[calc(1.25rem-1px)]"
              >
                <span class="h-6 w-6 transition-all group-hover:scale-115%" i-carbon-logo-google />
              </span>
            </a-button>
          </div>
        </div>

        <!-- Footer -->
        <div class="m-auto mb-5 flex flex-col justify-center text-center text-lg dark:text-slate-200">
          <div class="mt-5 flex flex-wrap items-center justify-center space-x-4">
            <a-button type="text" size="large" shape="circle">
              <span class="i-carbon-logo-github block h-5 w-5" />
            </a-button>
            <a-button type="text" size="large" shape="circle">
              <span class="i-carbon-logo-linkedin block h-5 w-5" />
            </a-button>
            <a-button type="text" size="large" shape="circle">
              <span class="i-carbon-logo-facebook block h-5 w-5" />
            </a-button>
            <a-button type="text" size="large" shape="circle">
              <span class="i-carbon-logo-twitter block h-5 w-5" />
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
