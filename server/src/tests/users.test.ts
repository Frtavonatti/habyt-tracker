import supertest from 'supertest'
import bcrypt from 'bcrypt'
import { test, describe, beforeEach } from 'node:test'
import assert from 'node:assert'

import app from '../index.js'
import { User } from '../models/index.js'
import type { UserResponse, LoginResponse } from '../types/user.types.js'

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

describe('PUT /api/users/:username', () => {
  let token: string

  beforeEach(async () => {
    const loginResponse = await api.post('/api/login').send({
      username: initialUser.username,
      password: initialUser.password
    }).expect(200)
    token = (loginResponse.body as LoginResponse).token
  })

  test('updates user username', async () => {
    const newUsername = 'updateduser'
    const response = await api.put(`/api/users/${initialUser.username}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ newUsername })
      .expect(200)
    const updated = response.body as UserResponse
    assert.strictEqual(updated.username, newUsername)
    const userInDb = await User.findOne({ where: { username: newUsername } })
    assert.ok(userInDb)
  })

  test('fails to update to an existing username', async () => {
    const anotherUser = {
      username: 'anotheruser',
      name: 'Another User',
      email: 'another@mail.com',
      password: 'password456'
    }
    await api.post('/api/users')
      .send(anotherUser)
      .expect(201)

    const response = await api.put(`/api/users/${initialUser.username}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ newUsername: anotherUser.username })
      .expect(400)
    const body = response.body as ErrorBody
    assert.strictEqual(body.error, 'Username must be unique')
  })

  test('fails to update non-existent user', async () => {
    const response = await api.put('/api/users/nonexistentuser')
      .set('Authorization', `Bearer ${token}`)
      .send({ newUsername: 'newusername' })
      .expect(404)
    const body = response.body as ErrorBody
    assert.strictEqual(body.error, 'User not found')
  })
})

describe('DELETE /api/users/:id', () => {
  let token: string

  beforeEach(async () => {
    const loginResponse = await api.post('/api/login').send({
      username: initialUser.username,
      password: initialUser.password
    }).expect(200)
    token = (loginResponse.body as LoginResponse).token
  })

  test('deletes a user by id', async () => {
    const user = await User.findOne({ where: { username: initialUser.username } })
    await api
    .delete(`/api/users/${user!.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)
    const userAfterDelete = await User.findByPk(user!.id)
    assert.strictEqual(userAfterDelete, null)
  })

  test('deletes a user by username', async () => {
    await api
    .delete(`/api/users/username/${initialUser.username}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)
    const userAfterDelete = await User.findOne({ where: { username: initialUser.username } })
    assert.strictEqual(userAfterDelete, null)
  })

  test('fails to delete non-existent user', async () => {
    const nonexistent = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'

    const response = await api
    .delete(`/api/users/${nonexistent}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(404)
    const body = response.body as ErrorBody
    assert.strictEqual(body.error, 'User not found')

    const responseByUsername = await api
    .delete('/api/users/username/nonexistentuser')
    .set('Authorization', `Bearer ${token}`)
    .expect(404)
    const bodyByUsername = responseByUsername.body as ErrorBody
    assert.strictEqual(bodyByUsername.error, 'User not found')
  })

  test('fails to delete another user', async () => {
    const anotherUser = {
      username: 'newuser',
      name: 'New User',
      email: 'newuser@mail.com',
      password: 'password'
    }
    await api.post('/api/users').send(anotherUser).expect(201)
    const userToDelete = await User.findOne({ where: { username: anotherUser.username } })

    const response = await api
    .delete(`/api/users/${userToDelete!.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(403)
    const body = response.body as ErrorBody
    assert.strictEqual(body.error, 'forbidden')
  })
})