import { describe, expect, it } from 'vitest'
import { createUserApi, equalUser, listUserApi, testUser } from './helper.js'

describe('List User: GET /api/v1/users', () => {
  it('200', async () => {
    const users = [testUser(), testUser(), testUser()]

    const createResp = [
      await createUserApi(users[0]),
      await createUserApi(users[1]),
      await createUserApi(users[2]),
    ]
    expect(createResp[0].response.status).toBe(200)
    expect(createResp[1].response.status).toBe(200)
    expect(createResp[2].response.status).toBe(200)

    const listResp = await listUserApi()
    expect(listResp.response.status).toBe(200)

    const listRespUsers = listResp.data?.filter(
      (resp) => users.filter((c) => c.email === resp.email).length !== 0,
    )
    expect(listRespUsers?.length).toBe(3)

    listRespUsers?.forEach((c, i) => equalUser(users.reverse()[i], createResp.reverse()[i].data, c))
  })
})
