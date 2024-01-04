import { getHotels } from '../helpers'

export default defineEventHandler(async (event) => {
  const {
    destination,
    dateIn,
    nights,
    compositions,
    from,
  } = getQuery(event)

  const filters = {
    destination: destination || 'paris-france',
    mediaCategories: 'mediaCategories',
    fields: 'mediaCategories',
    dateIn,
    nights,
    compositions,
    from: from || 0,
  }

  return await getHotels(filters).catch((error) => {
    console.error(error)
    throw createError({
      statusCode: 400,
    })
  })
})
