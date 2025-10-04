import supertest from "supertest"
import bcrypt from "bcrypt"
import { test, describe, beforeEach } from "node:test"
import assert from "node:assert"

import app from "../index.js"
import { User } from "../models/index.js"
import type { LoginResponse } from "../types/user.types.js"

interface BodyError {
  error: string
}

const api = supertest(app)

const userData = {
  name: "Test User",
  username: "testuser",
  email: "testmail@mail.com",
  password: "testpassword",
}

beforeEach(async () => {
  await User.destroy({ where: {} })
  const passwordHash = await bcrypt.hash(userData.password, 10)
  await User.create({
    username: userData.username,
    name: userData.name,
    email: userData.email,
    passwordHash,
  })
})

describe("POST /api/login with valid credentials", () => {
  test("should login successfully", async () => {
    const response = await api
      .post("/api/login")
      .send({ username: userData.username, password: userData.password })
      .expect(200)
      .expect("Content-Type", /application\/json/)
    const created = response.body as LoginResponse
    assert(created.token, "Response should contain a token")
    assert.strictEqual(created.username, userData.username)
    assert.strictEqual(created.name, userData.name)
  })
})

describe("POST /api/login with invalid credentials", () => {
  test("should fail login with incorrect password", async () => {
    const response = await api
      .post("/api/login")
      .send({ username: userData.username, password: "wrongpassword" })
      .expect(401)
      .expect("Content-Type", /application\/json/)
    const errorResponse = response.body as BodyError
    assert(errorResponse.error, "Response should contain an error message")
  })

  test("should fail login with non-existent username", async () => {
    const response = await api
      .post("/api/login")
      .send({ username: "nonexistent", password: "somepassword" })
      .expect(401)
      .expect("Content-Type", /application\/json/)
    const errorResponse = response.body as BodyError
    assert(errorResponse.error, "Response should contain an error message")
  })

  test("should fail login with missing username", async () => {
    const response = await api
      .post("/api/login")
      .send({ password: userData.password })
      .expect(400)
      .expect("Content-Type", /application\/json/)
    const errorResponse = response.body as BodyError
    assert(errorResponse.error, "Response should contain an error message")
  })

  test("should fail login with missing password", async () => {
    const response = await api
      .post("/api/login")
      .send({ username: userData.username })
      .expect(400)
      .expect("Content-Type", /application\/json/)
    const errorResponse = response.body as BodyError
    assert(errorResponse.error, "Response should contain an error message")
  })
})