import { autocomplete } from '../services'

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event)

  return await autocomplete(q)
})
