import { ofetch } from 'ofetch'
import dayjs from 'dayjs'

export default defineEventHandler(async (event) => {
  const userSession = await getUserSession(event)
  if (!userSession.user.google)
    return userSession

  const { access_token } = userSession.user.google
  const currentYear = dayjs().year()
  // January 1st of the current year
  const startDate = dayjs().year(currentYear).startOf('year')
  // January 1st of the next year
  const endDate = dayjs().year(currentYear + 1).startOf('year')
  const timeMin = startDate.toISOString()
  const timeMax = endDate.toISOString()

  const data = await ofetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).catch((error) => {
    throw new Error(error)
  })

  return data
})
