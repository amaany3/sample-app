import { OpenAPIHono } from '@hono/zod-openapi'
import { createUser } from './create'
import { deleteUser } from './delete'
import { getUser } from './get'
import { listUser } from './list'
import { updateUser } from './update'

export const userRoute = new OpenAPIHono()

userRoute.openapi(createUser.route, createUser.handler)
userRoute.openapi(getUser.route, getUser.handler)
userRoute.openapi(listUser.route, listUser.handler)
userRoute.openapi(deleteUser.route, deleteUser.handler)
userRoute.openapi(updateUser.route, updateUser.handler)
