import { describe, expect, it } from 'vitest'
import { createUserApi, equalUser, getUserApi, testUser } from './helper.js'

describe('Get User: GET /users/{id}', () => {
  it('200', async () => {
    const user = testUser()

    const createResp = await createUserApi(user)
    expect(createResp.response.status).toBe(200)
    expect(createResp.data?.id).toBeTruthy()

    const getResp = await getUserApi(createResp.data?.id ?? '')
    expect(createResp.response.status).toBe(200)
    equalUser(user, createResp.data, getResp.data)
  })
})
