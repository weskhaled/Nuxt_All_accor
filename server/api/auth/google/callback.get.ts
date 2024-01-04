import { z } from 'zod'

export default eventHandler<{ query: { code: string } }>(
  async (event) => {
    const query = getQuery(event)

    const { code } = z.object({
      code: z.string().min(5),
    }).parse(query) // code is typed as string

    return {
      body: {
        code,
      },
    }
  },
)
