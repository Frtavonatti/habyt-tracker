import supertest from "supertest"
import bcrypt from "bcrypt"
import { test, describe, beforeEach } from "node:test"
import assert from "node:assert"

import app from "../src/index.js"
import { User, Habyt, Entry } from "../src/models/index.js"
import { toDateOnlyUTC } from "../src/utils/toDateOnly.js"

import type { EntryBase, LoginResponse } from "../src/types/index.js"

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

  const initialDate = toDateOnlyUTC(new Date("August 20, 2025 23:15:30"))

  await Entry.create({
    ...initialEntry,
    date: initialDate,
    habytId: habyt.id
  })
})

const loginAndGetToken = async () => {
  const loginResponse = await api.post('/api/login').send({
    username: initialUser.username,
    password: initialUser.password
  }).expect(200)
  return (loginResponse.body as LoginResponse).token
}


describe("GET /habyts/:habytId/entries", () => {
  test("authenticated request return all habyt entries", async () => {
    const token = await loginAndGetToken()
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

describe("POST /habyts/:habytId/entries", () => {
  test("creates a new entry with valid data and token", async () => {
    const token = await loginAndGetToken()
    const habyt = await Habyt.findOne({ where: { title: initialHabyt.title } })

    const newEntry = {
      completed: true,
      timeSpentMinutes: 180,
    }

    const response = await api.post(`/api/habyts/${habyt?.id}/entries`)
      .set("Authorization", `Bearer ${token}`)
      .send(newEntry)
      .expect(201)
    
    const createdEntry = response.body as EntryBase
    assert.strictEqual(createdEntry.completed, newEntry.completed)
    assert.strictEqual(createdEntry.timeSpentMinutes, newEntry.timeSpentMinutes)
  })

  test("fails with 400 if timeSpentMinutes is negative", async () => {
    const token = await loginAndGetToken()
    const habyt = await Habyt.findOne({ where: { title: initialHabyt.title } })
    const newEntry = { timeSpentMinutes: -1 }

    await api.post(`/api/habyts/${habyt?.id}/entries`)
      .set("Authorization", `Bearer ${token}`)
      .send(newEntry)
      .expect(400)
  })

  test("fails with 409 if there is already an entry for the entry date", async () => {
    const token = await loginAndGetToken()
    const habyt = await Habyt.findOne({ where: { title: initialHabyt.title } })

    const entries = [
      { completed: true, timeSpentMinutes: 180 },
      { completed: false }
    ] 

    await api.post(`/api/habyts/${habyt?.id}/entries`)
      .set("Authorization", `Bearer ${token}`)
      .send(entries[0])
      .expect(201)
    
    await api.post(`/api/habyts/${habyt?.id}/entries`)
      .set("Authorization", `Bearer ${token}`)
      .send(entries[1])
      .expect(409)
  })
})

describe("PATCH /entries/:id", () => {
  test('updates an entry with valid data and token', async () => {
    const token = await loginAndGetToken()
    const entry = await Entry.findOne({ where: { timeSpentMinutes: initialEntry.timeSpentMinutes } })
    
    const updatedEntry = await api.patch(`/api/entries/${entry?.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ completed: !(entry?.completed) })
      .expect(200)
    
    const updatedEntryResponse = updatedEntry.body as EntryBase
    assert.strictEqual(entry?.id, updatedEntryResponse.id)
    assert.strictEqual(entry.completed, !(updatedEntryResponse.completed))
    assert.strictEqual(entry.timeSpentMinutes, updatedEntryResponse.timeSpentMinutes)
  })

  test('fails with 401 if token is missing', async () => {
    const entry = await Entry.findOne({ where: { timeSpentMinutes: initialEntry.timeSpentMinutes } })
    await api.patch(`/api/entries/${entry?.id}`)
      .send({ completed: !(entry?.completed) })
      .expect(401)
  })

  test('fails with 404 with invalid entryId', async ()=> {
    const nonExistentId = "99999999-9999-9999-9999-999999999999"
    const updateEntryData = { timeSpentMinutes: 120 }
    await api.patch(`/api/entries/${nonExistentId}`)
      .send({ completed: updateEntryData.timeSpentMinutes })
      .expect(401)
  })
})

describe("DELETE /entries/:id", () => {
  test('deletes an entry successfully with valid token', async () => {
    const token = await loginAndGetToken()
    const entry = await Entry.findOne({ where: { timeSpentMinutes: initialEntry.timeSpentMinutes } })
    const habyt = await Habyt.findOne({ where: { title: initialHabyt.title } }) 

    const entriesBefore = await Entry.findAll({ where: { habytId: habyt?.id } })
    
    await api.delete(`/api/entries/${entry?.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)

    const entriesAfter = await Entry.findAll({ where: { habytId: habyt?.id } })
    
    assert.strictEqual(entriesAfter.length, entriesBefore.length - 1)
  })

  test('deletes fail with 401 if invalid token', async () => {
    const entry = await Entry.findOne({ where: { timeSpentMinutes: initialEntry.timeSpentMinutes } })
    const habyt = await Habyt.findOne({ where: { title: initialHabyt.title } }) 

    const entriesBefore = await Entry.findAll({ where: { habytId: habyt?.id } })
    await api.delete(`/api/entries/${entry?.id}`).expect(401)
    const entriesAfter = await Entry.findAll({ where: { habytId: habyt?.id } })
    
    assert.strictEqual(entriesAfter.length, entriesBefore.length)
  })

  test('deletes fail with 404 if invalid params',async () => {
    const token = await loginAndGetToken()
    const habyt = await Habyt.findOne({ where: { title: initialHabyt.title } })
    const nonExistentId = "99999999-9999-9999-9999-999999999999"

    const entriesBefore = await Entry.findAll({ where: { habytId: habyt?.id } })
    
    await api.delete(`/api/entries/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404)

    const entriesAfter = await Entry.findAll({ where: { habytId: habyt?.id } })
    
    assert.strictEqual(entriesAfter.length, entriesBefore.length)
  })
})