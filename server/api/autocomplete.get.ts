import { autocomplete } from '../helpers'

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event)

  return await autocomplete(q)
})
