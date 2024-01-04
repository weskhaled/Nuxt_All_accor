import { getMediasHotel } from '../helpers'

export default defineEventHandler(async (event) => {
  const {
    id,
  } = getQuery(event)

  return await getMediasHotel(id)
})
