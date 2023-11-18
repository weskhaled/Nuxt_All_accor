import { createError } from 'h3'
import { getHotelRooms } from '../../../services'

export default defineEventHandler(async (event) => {
  const id = event?.context?.params?.id
  const {
    adults,
    childrenAges,
    dateIn,
    nights,
  } = getQuery(event)

  if (!id || !adults || !dateIn || !nights) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Data input missing',
    })
  }

  return await getHotelRooms(id, +adults, childrenAges, dateIn as string, +nights)
})
