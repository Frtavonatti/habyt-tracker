import supertest from 'supertest'
import bcrypt from 'bcrypt'
import { test, describe, beforeEach } from 'node:test'
import assert from 'node:assert'

import app from '../index.js'
import { User } from '../models/index.js'
import type { UserResponse } from '../types/user.types.js'

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

describe('GET /api/users', () => {
  test('returns all users', async () => {
    const response = await api.get('/api/users').expect(200)
    const users = response.body as UserResponse[]
    assert.strictEqual(Array.isArray(users), true)
    assert.strictEqual(users.length, 1)
    assert.strictEqual(users[0]?.username, initialUser.username)
  })

  test('GET /api/users/:id returns a user by id', async () => {
    const user = await User.findOne({ where: { username: initialUser.username } })
    const response = await api.get(`/api/users/${user!.id}`).expect(200)
    const body = response.body as UserResponse
    assert.strictEqual(body.username, initialUser.username)
  })

  test('GET /api/users/:id (UUID inexistente) retorna 404', async () => {
    const nonexistent = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'
    const response = await api.get(`/api/users/${nonexistent}`).expect(404)
    const body = response.body as ErrorBody
    assert.strictEqual(body.error, 'User not found')
  })
})

describe('POST /api/users', () => {
  test('creates a new user', async () => {
    const newUser = {
      username: 'anotheruser',
      name: 'Another User',
      email: 'another@example.com',
      password: 'password456'
    }
    const response = await api.post('/api/users').send(newUser).expect(201)
    const created = response.body as UserResponse
    assert.strictEqual(created.username, newUser.username)
    assert.strictEqual(created.email, newUser.email)
    const users = await User.findAll()
    assert.strictEqual(users.length, 2)
  })

  test('fails with duplicate username', async () => {
    const response = await api.post('/api/users').send({
      ...initialUser,
      email: 'unique@example.com'
    }).expect(400)
    const body = response.body as ErrorBody
    assert.strictEqual(body.error, 'Username must be unique')
  })

  test('fails with duplicate email', async () => {
    const response = await api.post('/api/users').send({
      username: 'uniqueuser',
      name: 'Unique User',
      email: initialUser.email,
      password: 'password789'
    }).expect(400)
    const body = response.body as ErrorBody
    assert.strictEqual(body.error, 'Email must be unique')
  })
})