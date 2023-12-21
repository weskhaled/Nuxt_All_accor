export default oauth.googleEventHandler({
  async onSuccess(event, { user, tokens }) {
    await setUserSession(event, {
      user: {
        google: {
          ...user,
          ...tokens,
        },
      },
      loggedInAt: Date.now(),
    })

    return sendRedirect(event, '/')
  },
})
