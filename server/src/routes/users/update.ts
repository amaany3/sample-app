import { type RouteHandler, z } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
import { isAlreadyExistError, isNotFoundError, prisma } from '../../infra/db'
import { errorDesc, errorSchema } from '../schema/error'
import { jsonBody, jsonResponse } from '../schema/json'

const paramsSchema = z.object({
  id: z
    .string()
    .uuid()
    .openapi({
      param: { name: 'id', in: 'path' },
      example: '778e7155-798c-4f06-ba52-e93535a60069',
    }),
})

const bodySchema = z.object({
  name: z.string().max(64).optional().openapi({
    example: 'John Doe',
  }),
  email: z.string().email().optional().openapi({
    example: 'john_doe@example.com',
  }),
})

const route = createRoute({
  method: 'put',
  path: '/{id}',
  request: {
    params: paramsSchema,
    body: jsonBody(bodySchema),
  },
  responses: {
    200: jsonResponse(z.object({}), 'Update User'),
    400: jsonResponse(errorSchema, errorDesc.BadRequest),
    404: jsonResponse(errorSchema, errorDesc.NotFound),
    409: jsonResponse(errorSchema, errorDesc.AlreadyExist),
    500: jsonResponse(errorSchema, errorDesc.InternalServer),
  },
})

const handler: RouteHandler<typeof route> = async (c) => {
  const { id } = c.req.valid('param')
  const { name, email } = c.req.valid('json')

  try {
    await prisma.users.update({
      where: { id },
      data: { name, email },
    })
    return c.json({}, 200)
  } catch (e) {
    if (isNotFoundError(e)) {
      return c.json({ message: 'Not Found' }, 404)
    }
    if (isAlreadyExistError(e)) {
      return c.json({ message: 'Already Exist' }, 409)
    }
    throw e
  }
}

export const updateUser = { route, handler }
