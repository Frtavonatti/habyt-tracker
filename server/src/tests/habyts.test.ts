import supertest from "supertest"
import bcrypt from "bcrypt"
import { test, describe, beforeEach } from "node:test"
import assert from "node:assert"

import app from "../index.js"
import { User, Habyt } from "../models/index.js"
import type { HabytResponse } from "../types/habyt.types.js"
import type { LoginResponse } from "../types/user.types.js"

const api = supertest(app)

const initialUser = {
  username: "testuser",
  name: "Test User",
  email: "test@mail.com",
  password: "securepassword",
}

const habytList = [
  { title: "Morning Run", description: "Run 5km every morning" },
  { title: "Read Books", description: "Read for 30 minutes daily" },
  { title: "Meditation", description: "Meditate for 10 minutes" },
]

beforeEach(async () => {
  await User.destroy({ where: {} })
  await Habyt.destroy({ where: {} })

  const passwordHash = await bcrypt.hash(initialUser.password, 10)
  const user = await User.create({
    username: initialUser.username,
    name: initialUser.name,
    email: initialUser.email,
    passwordHash,
  })

  for (const habyt of habytList) {
    await Habyt.create({ ...habyt, userId: user.id })
  }
})

describe("GET /api/habyts", () => {
  test("return all habyts", async () => {
    const response = await api.get("/api/habyts").expect(200)
    const habyts = response.body as HabytResponse[]
    assert.strictEqual(Array.isArray(habyts), true)
    assert.strictEqual(habyts.length, 3)
  })

  test("/:id returns a habyt by id", async () => {
    const habyt = await Habyt.findOne({ where: { title: habytList[0]!.title } })
    const response = await api.get(`/api/habyts/${habyt!.id}`).expect(200)
    const body = response.body as HabytResponse
    assert.strictEqual(body.title, habytList[0]!.title)
  })
})

describe("POST /api/habyts", () => {
  test("creates a new habyt with valid data and token", async () => {
    const loginResponse = await api.post("/api/login").send({
      username: initialUser.username,
      password: initialUser.password,
    }).expect(200)

    const { token } = loginResponse.body as LoginResponse

    const newHabyt = { title: "Yoga", description: "Practice yoga daily"}
    const response = await api.post("/api/habyts")
      .set("Authorization", `Bearer ${token}`)
      .send(newHabyt)
      .expect(201)

    const createdHabyt = response.body as HabytResponse
    assert.strictEqual(createdHabyt.title, newHabyt.title)
    assert.strictEqual(createdHabyt.description, newHabyt.description)

    const habytsAtEnd = await Habyt.findAll()
    assert.strictEqual(habytsAtEnd.length, habytList.length + 1)
    const titles = habytsAtEnd.map(h => h.title)
    assert.strictEqual(titles.includes(newHabyt.title), true)
  })

  test("fails with 400 if title is missing", async () => {
    const loginResponse = await api.post("/api/login").send({
      username: initialUser.username,
      password: initialUser.password,
    }).expect(200)

    const { token } = loginResponse.body as LoginResponse
    const newHabyt = { description: "No title provided" }
    await api.post("/api/habyts")
      .set("Authorization", `Bearer ${token}`)
      .send(newHabyt)
      .expect(400)
  })

  test("fails with 401 if token is missing", async () => {
    const newHabyt = { title: "No Auth", description: "Missing token" }
    await api.post("/api/habyts")
      .send(newHabyt)
      .expect(401)
  })
})

describe("DELETE /api/habyts/:id", () => {
  test("deletes a habyt with valid id and token", async () => {
    const loginResponse = await api.post("/api/login").send({
      username: initialUser.username,
      password: initialUser.password,
    }).expect(200)

    const { token } = loginResponse.body as LoginResponse
    const habytToDelete = await Habyt.findOne({ where: { title: habytList[1]!.title } })
    assert(habytToDelete, "Habyt to delete should exist")
    const habytsAtStart = await Habyt.findAll()

    await api.delete(`/api/habyts/${habytToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)

    const habytAfterDelete = await Habyt.findByPk(habytToDelete.id)
    assert.strictEqual(habytAfterDelete, null)

    const habytsAtEnd = await Habyt.findAll()
    assert.strictEqual(habytsAtEnd.length, habytsAtStart.length - 1)
  })

  test("fails with 404 if habyt does not exist", async () => {
    const loginResponse = await api.post("/api/login").send({
      username: initialUser.username,
      password: initialUser.password,
    }).expect(200)

    const { token } = loginResponse.body as LoginResponse
    const nonExistentId = "99999999-9999-9999-9999-999999999999"
    await api.delete(`/api/habyts/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404)
  })

  test("fails with 401 if token is missing", async () => {
    const habytToDelete = await Habyt.findOne({ where: { title: habytList[0]!.title } })
    assert(habytToDelete, "Habyt to delete should exist")

    await api.delete(`/api/habyts/${habytToDelete.id}`)
      .expect(401)
  })
})