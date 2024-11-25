import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { prisma } from '../../src/infra/db'
import { client } from '../globalSetup'

const user = {
  name: 'delete test',
  email: 'delete@test.com',
}

async function deleteUser(id: string) {
  return client.DELETE('/users/{id}', { params: { path: { id } } })
}

describe('Delete User: DELETE /users/:id', () => {
  it('200', async () => {
    const dbUser = await prisma.users.create({ data: user })
    const resp = await deleteUser(dbUser.id)

    expect(resp.response.status).toBe(200)
    expect(await prisma.users.count({ where: { id: dbUser.id } })).toBe(0)
  })

  it('400: id uuid', async () => {
    const resp = await deleteUser('id')
    expect(resp.response.status).toBe(400)
  })

  it('404', async () => {
    const resp = await deleteUser(randomUUID())
    expect(resp.response.status).toBe(404)
  })
})
