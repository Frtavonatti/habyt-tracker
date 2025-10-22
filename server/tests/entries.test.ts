import supertest from "supertest"
import bcrypt from "bcrypt"
import { test, describe, beforeEach } from "node:test"
import assert from "node:assert"

import app from "../src/index.js"
import { User, Habyt, Entry } from "../src/models/index.js"
import { toDateOnlyUTC } from "../src/utils/toDateOnly.js"

import type { EntryBase, EntryResponse, LoginResponse } from "../src/types/index.js"

const api = supertest(app)

const initialUser = {
  username: "testuser",
  name: "Test User",
  email: "test@mail.com",
  password: "securepassword",
}

const initialHabyt = { title: "Read Books", description: "Read for 30 minutes daily" }

const initialEntry = { completed: true, timeSpentMinutes: 30 }

beforeEach(async () => {
  await User.destroy({ where: {} })
  await Habyt.destroy({ where: {} })
  await Entry.destroy({ where: {} })

  const passwordHash = await bcrypt.hash(initialUser.password, 10)
  const user = await User.create({
    username: initialUser.username,
    name: initialUser.name,
    email: initialUser.email,
    passwordHash,
  })

  const habyt = await Habyt.create({ ...initialHabyt, userId: user.id })

  await Entry.create({
    ...initialEntry,
    date: toDateOnlyUTC(new Date),
    habytId: habyt.id
  })
})

describe("GET /habyts/:habytId/entries", () => {
  test("authenticated request return all habyt entries", async () => {
    const loginResponse = await api.post('/api/login').send({
      username: initialUser.username,
      password: initialUser.password
    }).expect(200)

    const { token } = loginResponse.body as LoginResponse

    const habyt = await Habyt.findOne({ where: { title: initialHabyt.title } })

    const response = await api
      .get(`/api/habyts/${habyt?.id}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    
    const entries = response.body as EntryBase[]
    assert.strictEqual(entries.length, 1)
    assert.strictEqual(entries[0]?.completed, initialEntry.completed)
    assert.strictEqual(entries[0]?.timeSpentMinutes, initialEntry.timeSpentMinutes)
  })

  test("fails with a 401 if token is missing", async () => {
    const habyt = await Habyt.findOne({ where: { title: initialHabyt.title } })
    await api.get(`/api/habyts/${habyt?.id}/entries`).expect(401)
  })
})