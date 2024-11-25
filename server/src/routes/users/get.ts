import { type RouteHandler, z } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
import { isNotFoundError, prisma } from '../../infra/db'
import { errorDesc, errorSchema } from '../schema/error'
import { jsonResponse } from '../schema/json'
import { userSchema } from '../schema/user'

const paramsSchema = z.object({
  id: z
    .string()
    .uuid()
    .openapi({
      param: { name: 'id', in: 'path' },
      example: '778e7155-798c-4f06-ba52-e93535a60069',
    }),
})

const route = createRoute({
  method: 'get',
  path: '/{id}',
  request: {
    params: paramsSchema,
  },
  responses: {
    200: jsonResponse(userSchema, 'Get User'),
    400: jsonResponse(errorSchema, errorDesc.BadRequest),
    404: jsonResponse(errorSchema, errorDesc.NotFound),
    500: jsonResponse(errorSchema, errorDesc.InternalServer),
  },
})

const handler: RouteHandler<typeof route> = async (c) => {
  const { id } = c.req.valid('param')

  try {
    const user = await prisma.users.findUniqueOrThrow({
      where: { id },
    })
    return c.json(user, 200)
  } catch (e) {
    if (isNotFoundError(e)) {
      return c.json({ message: 'Not Found' }, 404)
    }
    throw e
  }
}

export const getUser = { route, handler }
