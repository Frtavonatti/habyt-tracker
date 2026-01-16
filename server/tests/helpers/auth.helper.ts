import type supertest from "supertest"
import bcrypt from "bcrypt"
import type { LoginResponse } from "../../../shared/src/index.js"
import { User } from "../../src/models/index.js"

export const createAndLoginUser = async (
  api: ReturnType<typeof supertest>,
  userdata: { username: string; name: string; email: string; password: string }
) => {
  await api.post('/api/users').send(userdata).expect(201)
  
  const loginResponse = await api.post('/api/login')
    .send({ username: userdata.username, password: userdata.password })
    .expect(200)
  
  return (loginResponse.body as LoginResponse).token
}

export const createAnotherUserAndGetToken = async (
  api: ReturnType<typeof supertest>
) => {
  const anotherUser = {
    username: `testuser-${Date.now()}`,
    name: "Another User",
    email: `another-${Date.now()}@mail.com`,
    password: "password123"
  }
  
  return await createAndLoginUser(api, anotherUser)
}

export const createInitialUser = async (
  userdata: { username: string; name: string; email: string; password: string }
) => {
  const passwordHash = await bcrypt.hash(userdata.password, 10)
  return await User.create({
    username: userdata.username,
    name: userdata.name,
    email: userdata.email,
    passwordHash
  })
}
