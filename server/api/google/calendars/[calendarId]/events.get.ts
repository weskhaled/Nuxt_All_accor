import { ofetch } from 'ofetch'
import dayjs from 'dayjs'

export default defineEventHandler(async (event) => {
  const calendarId = event?.context?.params?.calendarId
  const userSession = await getUserSession(event)

  if (!userSession?.user?.google)
    return userSession

  const { loggedInAt } = userSession
  const { access_token, expires_in } = userSession.user?.google

  const currentYear = dayjs().year()
  // January 1st of the current year
  const startDate = dayjs().year(currentYear).startOf('year')
  // January 1st of the next year
  const endDate = dayjs().year(currentYear + 1).startOf('year').subtract(1, 'day')
  const timeMin = startDate.toISOString()
  const timeMax = endDate.toISOString()
  const expiryDate = loggedInAt + expires_in * 1000

  if (expiryDate < Date.now()) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Google token expired',
    })
  }

  const events = await ofetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${timeMin}&timeMax=${timeMax}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).catch((error) => {
    throw createError({
      statusCode: error.statusCode,
      statusMessage: error.statusCode === 401 ? 'Google token expired' : 'Google token invalid',
    })
  })

  return events.items?.map((event: any) => ({
    ...event,
    title: event.summary,
    start: dayjs(event.start.dateTime),
    end: dayjs(event.end.dateTime),
    color: '#00aaff',
  }))
})
