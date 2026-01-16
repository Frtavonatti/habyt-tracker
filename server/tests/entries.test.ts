import supertest from "supertest"
import bcrypt from "bcrypt"
import { test, describe, beforeEach } from "node:test"
import assert from "node:assert"
import { randomUUID } from "node:crypto"

import app from "../src/index.js"
import { User, Habyt, Entry } from "../src/models/index.js"
import { toDateOnlyUTC } from "../src/utils/toDateOnly.js"

import type { Entry as EntryBase, LoginResponse } from "../../shared/src/index.js"

const api = supertest(app)

const initialUser = {
  username: "testuser",
  name: "Test User",
  email: "test@mail.com",
  password: "securepassword",
}

const initialHabyt = { title: "Read Books", description: "Read for 30 minutes daily" }
const initialEntry = { completed: true, timeSpentMinutes: 30 }
const nonExistentId = randomUUID()

const loginAndGetToken = async () => {
  const loginResponse = await api.post('/api/login').send({
    username: initialUser.username,
    password: initialUser.password
  }).expect(200)
  return (loginResponse.body as LoginResponse).token
}

const createAnotherUser = async () => {
  const anotherUser = {
    username: `testuser-${Date.now()}`,
    name: "Another User",
    email: `another-${Date.now()}@mail.com`,
    password: "password123"
  }
  await api.post('/api/users').send(anotherUser).expect(201)
  
  const loginResponse = await api.post('/api/login')
    .send({ username: anotherUser.username, password: anotherUser.password })
    .expect(200)
  
  return (loginResponse.body as LoginResponse).token
}

let user: User, habyt: Habyt, token: string

beforeEach(async () => {
  await User.destroy({ where: {} })
  await Habyt.destroy({ where: {} })
  await Entry.destroy({ where: {} })

  const passwordHash = await bcrypt.hash(initialUser.password, 10)
  user = await User.create({ ...initialUser, passwordHash })
  habyt = await Habyt.create({ ...initialHabyt, userId: user.id })
  token = await loginAndGetToken()

  const initialDate = toDateOnlyUTC(new Date("August 20, 2025 23:15:30"))
  await Entry.create({ ...initialEntry, date: initialDate, habytId: habyt.id })
})


describe("GET /habyts/:habytId/entries", () => {
  test("authenticated request return all habyt entries", async () => {
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
    await api.get(`/api/habyts/${habyt?.id}/entries`).expect(401)
  })

  test("fails with 403 if user is not the habyt owner", async () => {
    const anotherToken = await createAnotherUser()

    const response = await api.get(`/api/habyts/${habyt?.id}/entries`)
      .set('Authorization', `Bearer ${anotherToken}`)
      .expect(403)
    
    assert.strictEqual(response.body.error, "Forbidden")
  })
})

describe("POST /habyts/:habytId/entries", () => {
  test("creates a new entry with valid data and token", async () => {
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

  test("creates a new entry with retroactive date", async () => {
    const retroactiveDate = toDateOnlyUTC(new Date("2025-01-15"))
    const newEntry = {
      completed: true,
      timeSpentMinutes: 60,
      date: retroactiveDate
    }

    const response = await api.post(`/api/habyts/${habyt?.id}/entries`)
      .set("Authorization", `Bearer ${token}`)
      .send(newEntry)
      .expect(201)
    
    const createdEntry = response.body as EntryBase
    assert.strictEqual(createdEntry.completed, newEntry.completed)
    assert.strictEqual(createdEntry.timeSpentMinutes, newEntry.timeSpentMinutes)
    assert.strictEqual(createdEntry.date, retroactiveDate)
  })

  test("creates entry with today's date when date is not provided", async () => {
    const newEntry = {
      completed: false,
      timeSpentMinutes: 45
    }

    const response = await api.post(`/api/habyts/${habyt?.id}/entries`)
      .set("Authorization", `Bearer ${token}`)
      .send(newEntry)
      .expect(201)
    
    const createdEntry = response.body as EntryBase
    const today = toDateOnlyUTC(new Date())
    assert.strictEqual(createdEntry.date, today)
  })

  test("fails with 400 if date format is invalid", async () => {
    const newEntry = {
      completed: true,
      date: "invalid-date-format"
    }
    
    const response = await api.post(`/api/habyts/${habyt?.id}/entries`)
      .set("Authorization", `Bearer ${token}`)
      .send(newEntry)
      .expect(400)
    
    assert.strictEqual(response.body.error, "Validation failed")
  })

  test("fails with 400 if timeSpentMinutes is negative", async () => {
    const newEntry = { timeSpentMinutes: -1 }
    const response = await api.post(`/api/habyts/${habyt?.id}/entries`)
      .set("Authorization", `Bearer ${token}`)
      .send(newEntry)
      .expect(400)
    
    assert.strictEqual(response.body.error, "Validation failed")
  })

  test("fails with 409 if there is already an entry for the entry date", async () => {
    const entries = [
      { completed: true, timeSpentMinutes: 180 },
      { completed: false }
    ] 

    await api.post(`/api/habyts/${habyt?.id}/entries`)
      .set("Authorization", `Bearer ${token}`)
      .send(entries[0])
      .expect(201)
    
    const response = await api.post(`/api/habyts/${habyt?.id}/entries`)
      .set("Authorization", `Bearer ${token}`)
      .send(entries[1])
      .expect(409)
    
    assert.strictEqual(response.body.error, "Entry for this date already exists")
  })

  test("fails with 409 when trying to create duplicate retroactive entry", async () => {
    const retroactiveDate = toDateOnlyUTC(new Date("2025-03-10"))
    const entry1 = {
      completed: true,
      timeSpentMinutes: 30,
      date: retroactiveDate
    }
    const entry2 = {
      completed: false,
      date: retroactiveDate
    }

    await api.post(`/api/habyts/${habyt?.id}/entries`)
      .set("Authorization", `Bearer ${token}`)
      .send(entry1)
      .expect(201)
    
    const response = await api.post(`/api/habyts/${habyt?.id}/entries`)
      .set("Authorization", `Bearer ${token}`)
      .send(entry2)
      .expect(409)
    
    assert.strictEqual(response.body.error, "Entry for this date already exists")
  })

  test("fails with 401 if token is missing", async () => {
    const newEntry = { completed: true }
    await api.post(`/api/habyts/${habyt?.id}/entries`)
      .send(newEntry)
      .expect(401)
  })

  test("fails with 403 if user is not the habyt owner", async () => {
    const anotherToken = await createAnotherUser()

    const newEntry = { completed: true }
    const response = await api.post(`/api/habyts/${habyt?.id}/entries`)
      .set("Authorization", `Bearer ${anotherToken}`)
      .send(newEntry)
      .expect(403)
    
    assert.strictEqual(response.body.error, "Forbidden")
  })
})

describe("PATCH /entries/:id", () => {
  test('updates an entry with valid data and token', async () => {
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
    const updateEntryData = { timeSpentMinutes: 120 }
    const response = await api.patch(`/api/entries/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ timeSpentMinutes: updateEntryData.timeSpentMinutes })
      .expect(404)
    
    assert.strictEqual(response.body.error, "Entry not found")
  })

  test('fails with 403 if user is not the habyt owner', async () => {
    const entry = await Entry.findOne({ where: { timeSpentMinutes: initialEntry.timeSpentMinutes } })
    const anotherToken = await createAnotherUser()

    const response = await api.patch(`/api/entries/${entry?.id}`)
      .set("Authorization", `Bearer ${anotherToken}`)
      .send({ completed: false })
      .expect(403)
    
    assert.strictEqual(response.body.error, "Forbidden")
  })
})

describe("DELETE /entries/:id", () => {
  test('deletes an entry successfully with valid token', async () => {
    const entry = await Entry.findOne({ where: { timeSpentMinutes: initialEntry.timeSpentMinutes } })
    const entriesBefore = await Entry.findAll({ where: { habytId: habyt?.id } })

    await api.delete(`/api/entries/${entry?.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)

    const entriesAfter = await Entry.findAll({ where: { habytId: habyt?.id } })
    assert.strictEqual(entriesAfter.length, entriesBefore.length - 1)
  })

  test('fails with 401 if token is missing', async () => {
    const entry = await Entry.findOne({ where: { timeSpentMinutes: initialEntry.timeSpentMinutes } })
    const entriesBefore = await Entry.findAll({ where: { habytId: habyt?.id } })
    await api.delete(`/api/entries/${entry?.id}`).expect(401)
    const entriesAfter = await Entry.findAll({ where: { habytId: habyt?.id } })
    assert.strictEqual(entriesAfter.length, entriesBefore.length)
  })

  test('fails with 404 if entry does not exist', async () => {
    const habyt = await Habyt.findOne({ where: { title: initialHabyt.title } })
    const entriesBefore = await Entry.findAll({ where: { habytId: habyt?.id } })
    
    const response = await api.delete(`/api/entries/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404)

    assert.strictEqual(response.body.error, "Entry not found")

    const entriesAfter = await Entry.findAll({ where: { habytId: habyt?.id } })
    assert.strictEqual(entriesAfter.length, entriesBefore.length)
  })

  test('fails with 403 if user is not the habyt owner', async () => {
    const entry = await Entry.findOne({ where: { timeSpentMinutes: initialEntry.timeSpentMinutes } })
    const anotherToken = await createAnotherUser()

    const response = await api.delete(`/api/entries/${entry?.id}`)
      .set("Authorization", `Bearer ${anotherToken}`)
      .expect(403)

    assert.strictEqual(response.body.error, "Forbidden")

    const entryAfterDelete = await Entry.findByPk(entry?.id)
    assert.ok(entryAfterDelete)
  })
})