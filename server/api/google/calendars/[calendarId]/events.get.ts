import { google } from 'googleapis'
import dayjs from 'dayjs'

import { randomColor } from '~/common/utils'

import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

function useGoogleClient(googleClientId: string, googleClientSecret: string) {
  const oAuth2Client = new google.auth.OAuth2(googleClientId, googleClientSecret)

  function getGoogleClient(access_token: string, refresh_token: string) {
    oAuth2Client.setCredentials({ access_token, refresh_token })
    return oAuth2Client
  }

  function refreshToken(refresh_token: string) {
    oAuth2Client.setCredentials({ refresh_token })
    return oAuth2Client.refreshAccessToken()
  }

  function googleCalendar(access_token: string) {
    oAuth2Client.setCredentials({ access_token })
    return google.calendar({ version: 'v3', auth: oAuth2Client })
  }

  return {
    getGoogleClient,
    refreshToken,
    googleCalendar,
  }
}

export default eventHandler(async (event) => {
  const { google_client_id, google_client_secret } = useRuntimeConfig(event)

  const supabaseUser = await serverSupabaseUser(event)
  const supabaseClient = await serverSupabaseClient(event)

  const calendarId = event?.context?.params?.calendarId

  if (!supabaseUser || !calendarId)
    return []

  const { data, error }: any = await supabaseClient.from('profile').select('*').eq('user_id', supabaseUser.id).single()

  if (error)
    throw error

  let google_provider_token = data.google_provider_token

  if (!data?.google_provider_refresh_token || !google_provider_token)
    throw new Error('No refresh token found')

  const { refreshToken, googleCalendar } = useGoogleClient(google_client_id, google_client_secret)

  if (data.google_provider_token_expiry_date < Date.now() || !google_provider_token) {
    const { credentials: newCredentials } = await refreshToken(data.google_provider_refresh_token)

    if (!newCredentials)
      throw new Error('No access token found')

    const { access_token, refresh_token, expiry_date } = newCredentials

    await supabaseClient.from('profile').update(
      {
        google_provider_token: access_token,
        google_provider_refresh_token: refresh_token,
        google_provider_token_expiry_date: expiry_date,
      },
    ).eq('user_id', supabaseUser.id).single() as any

    google_provider_token = access_token
  }

  const calendar = googleCalendar(google_provider_token)
  const currentYear = dayjs().year()
  // January 1st of the current year
  const startDate = dayjs().year(currentYear).startOf('year')
  // January 1st of the next year
  const endDate = dayjs().year(currentYear + 1).startOf('year').subtract(1, 'day')
  const timeMin = startDate.toISOString()
  const timeMax = endDate.toISOString()

  const events = await calendar.events.list({
    calendarId,
    timeMin,
    timeMax,
  })

  return events.data.items?.map((event: any) => ({
    id: event.id,
    status: event.status,
    title: event.summary,
    description: event.description,
    start: dayjs(event.start.dateTime),
    end: dayjs(event.end.dateTime),
    eventUrl: event.htmlLink,
    attachments: event.attachments || [],
    attendees: event.attendees || [],
    creator: event.creator,
    organizer: event.organizer,
    hangoutLink: event.hangoutLink,
    color: randomColor(),
  }))
})
