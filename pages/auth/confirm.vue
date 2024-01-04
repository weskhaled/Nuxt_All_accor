<script setup lang="ts">
const { dayjs } = useDayjs()
// const user = useSupabaseUser()
const supabaseClient = useSupabaseClient()

onMounted(async () => {
  const { data } = await supabaseClient.auth.getSession()
  const { session } = data

  if (session) {
    const { provider_token, provider_refresh_token, user } = session

    if (!user || !provider_token || !provider_refresh_token)
      return

    // save auth token & refresh token for a current user profile.
    await supabaseClient
      .from('profile')
      .update({
        google_provider_token: `${provider_token}`,
        google_provider_refresh_token: `${provider_refresh_token}`,
        google_provider_token_expiry_date: `${dayjs().add(1, 'hour').valueOf()}`,
      })
      .eq('user_id', user.id)
      .select()
      .single()
  }

  if (session?.user)
    return navigateTo('/')
})
// watch(user, () => {
//   const { data } = await supabaseClient.auth.getSession()
//   const { session } = data
//   console.log('supabaseClient', session)

//   if (session) {
//     // save auth token & refresh token for a current user profile.
//     const { error } = await supabaseClient
//       .from('profile')
//       .update({
//         google_provider_token: session.provider_token,
//         google_provider_refresh_token: session.provider_refresh_token,
//       })
//       .eq('user_id', session.user.id)
//       .select()
//       .single()

//     if (error) {
//       // handle error.
//       throw error
//     }
//   }
//   console.log('user', user.value)
//   if (user.value)
//     return navigateTo('/')
// }, { immediate: true })
</script>

<template>
  <div>Waiting for login...</div>
</template>
