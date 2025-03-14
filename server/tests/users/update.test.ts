import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import type { paths } from '../schema.js'
import { createUserApi, equalUser, getUserApi, testUser, updateUserApi } from './helper.js'

const updateUserAllFiled: paths['/api/v1/users/{userId}']['put']['requestBody']['content']['application/json'] =
  {
    name: randomUUID(),
    email: `${randomUUID()}@example.com`,
  }

const updateUserOnlyFiled: paths['/api/v1/users/{userId}']['put']['requestBody']['content']['application/json'] =
  {
    name: randomUUID(),
    // email: `${randomUUID()}@example.com`,
  }

describe('Update User: PUT /users/{userId}', () => {
  it('200: all filed', async () => {
    const user = testUser()

    const createResp = await createUserApi(user)
    expect(createResp.response.status).toBe(200)
    expect(createResp.data?.id).toBeTruthy()

    const updateResp = await updateUserApi(createResp.data?.id ?? '', updateUserAllFiled)
    expect(updateResp.response.status).toBe(200)

    const getResp = await getUserApi(createResp.data?.id ?? '')
    expect(getResp.response.status).toBe(200)
    equalUser({ ...user, ...updateUserAllFiled }, createResp.data, getResp.data)
  })

  it('200: only filed', async () => {
    const user = testUser()

    const createResp = await createUserApi(user)
    expect(createResp.response.status).toBe(200)
    expect(createResp.data?.id).toBeTruthy()

    const updateResp = await updateUserApi(createResp.data?.id ?? '', updateUserOnlyFiled)
    expect(updateResp.response.status).toBe(200)

    const getResp = await getUserApi(createResp.data?.id ?? '')
    expect(getResp.response.status).toBe(200)
    equalUser({ ...user, ...updateUserOnlyFiled }, createResp.data, getResp.data)
  })
})
