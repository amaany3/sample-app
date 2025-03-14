import { OpenAPIHono } from '@hono/zod-openapi'
import { createAPI } from './create.js'
import { deleteAPI } from './delete.js'
import { getAPI } from './get.js'
import { listAPI } from './list.js'
import { updateAPI } from './update.js'

export const userRoute = new OpenAPIHono()

userRoute.openapi(createAPI.route, createAPI.handler)
userRoute.openapi(getAPI.route, getAPI.handler)
userRoute.openapi(listAPI.route, listAPI.handler)
userRoute.openapi(deleteAPI.route, deleteAPI.handler)
userRoute.openapi(updateAPI.route, updateAPI.handler)
