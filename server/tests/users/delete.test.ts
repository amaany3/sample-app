import { describe, expect, it } from 'vitest'
import { createUserApi, deleteUserApi, getUserApi, testUser } from './helper.js'

describe('Delete User: DELETE /users/{id}', () => {
  it('200', async () => {
    const user = testUser()

    const createResp = await createUserApi(user)
    expect(createResp.response.status).toBe(200)
    expect(createResp.data?.id).toBeTruthy()

    const deleteResp = await deleteUserApi(createResp.data?.id ?? '')
    expect(deleteResp.response.status).toBe(200)

    const getResp = await getUserApi(createResp.data?.id ?? '')
    expect(getResp.response.status).toBe(404)
  })
})
