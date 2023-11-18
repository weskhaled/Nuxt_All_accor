import { getMediasHotel } from '../services'

export default defineEventHandler(async (event) => {
  const {
    id,
  } = getQuery(event)

  return await getMediasHotel(id)
})
