export default defineNuxtRouteMiddleware(() => {
  const { session, user, loggedIn } = useUserSession()

  if (!loggedIn.value || !user.value?.google)
    return navigateTo('/auth')

  const expires_in = user.value?.google?.expires_in
  const expiryDate = session.value.loggedInAt + expires_in * 1000

  if (expiryDate < Date.now())
    navigateTo('/api/auth/google')
})
