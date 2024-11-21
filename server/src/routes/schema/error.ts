import { z } from '@hono/zod-openapi'

export const errorSchema = z.object({
  message: z.string(),
})

export const errorDesc = {
  AlreadyExist: 'Already Exist Error',
  NotFound: 'Not Found Error',
  InternalServer: 'Internal Server Error',
}
