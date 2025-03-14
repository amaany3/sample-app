import { z } from '@hono/zod-openapi'

export const userParamsSchema = z.object({
  userId: z
    .string()
    .uuid()
    .openapi({
      param: { name: 'userId', in: 'path' },
      example: '778e7155-798c-4f06-ba52-e93535a60069',
    }),
})

export const userSchema = z
  .object({
    id: z.string().uuid().openapi({
      example: '778e7155-798c-4f06-ba52-e93535a60069',
    }),
    name: z.string().max(64).openapi({
      example: 'John Doe',
    }),
    email: z.string().email().openapi({
      example: 'john_doe@example.com',
    }),
    createdAt: z.date().openapi({
      example: '2024-11-04T10:59:02.136Z',
    }),
    updatedAt: z.date().openapi({
      example: '2024-11-04T10:59:02.136Z',
    }),
  })
  .openapi('User')

export type userType = z.infer<typeof userSchema>
