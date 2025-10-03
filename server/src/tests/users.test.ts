import supertest from 'supertest'
import { describe, it, before, beforeEach, after } from 'node:test'
import assert from 'node:assert'
import bcrypt from 'bcrypt'

import app from '../index.js'
import { sequelize } from '../utils/db.js'
import { User } from '../models/index.js'

interface PublicUser {
  id: number
  username: string
  name: string
  email: string
}

interface ErrorBody {
  error: string
}

const api = supertest(app)

const initialUser = {
  username: 'testuser',
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'password123'
}

before(async () => {
  await sequelize.sync({ force: true })
})

beforeEach(async () => {
  await User.destroy({ where: {} })
  const passwordHash = await bcrypt.hash(initialUser.password, 10)
  await User.create({
    username: initialUser.username,
    name: initialUser.name,
    email: initialUser.email,
    passwordHash
  })
})

after(async () => {
  await sequelize.close()
  process.exit(0)
})

describe('User Endpoints', () => {
  it('GET /api/users returns all users', async () => {
    const response = await api.get('/api/users').expect(200)
    const users = response.body as PublicUser[]
    assert.strictEqual(Array.isArray(users), true)
    assert.strictEqual(users.length, 1)
    assert.strictEqual(users[0].username, initialUser.username)
  })

  it('GET /api/users/:id returns a user by id', async () => {
    const user = await User.findOne({ where: { username: initialUser.username } })
    const response = await api.get(`/api/users/${user!.id}`).expect(200)
    const body = response.body as PublicUser
    assert.strictEqual(body.username, initialUser.username)
  })

  it('POST /api/users creates a new user', async () => {
    const newUser = {
      username: 'anotheruser',
      name: 'Another User',
      email: 'another@example.com',
      password: 'password456'
    }
    const response = await api.post('/api/users').send(newUser).expect(201)
    const created = response.body as PublicUser
    assert.strictEqual(created.username, newUser.username)
    assert.strictEqual(created.email, newUser.email)
    const users = await User.findAll()
    assert.strictEqual(users.length, 2)
  })

  it('POST /api/users fails with duplicate username', async () => {
    const response = await api.post('/api/users').send({
      ...initialUser,
      email: 'unique@example.com'
    }).expect(400)
    const body = response.body as ErrorBody
    assert.strictEqual(body.error, 'Username must be unique')
  })

  it('POST /api/users fails with duplicate email', async () => {
    const response = await api.post('/api/users').send({
      username: 'uniqueuser',
      name: 'Unique User',
      email: initialUser.email,
      password: 'password789'
    }).expect(400)
    const body = response.body as ErrorBody
    assert.strictEqual(body.error, 'Email must be unique')
  })

  it('GET /api/users/:id (UUID inexistente) retorna 404', async () => {
    const nonexistent = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'
    const response = await api.get(`/api/users/${nonexistent}`).expect(404)
    const body = response.body as ErrorBody
    assert.strictEqual(body.error, 'User not found')
  })
})