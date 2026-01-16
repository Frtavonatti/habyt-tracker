import supertest from "supertest"
import type { LoginResponse } from "../../../shared/src/index.js"

export const createAndLoginUser = async (
  api: supertest.SuperTest<supertest.Test>,
  userdata: { username: string; name: string; email: string; password: string }
) => {
  await api.post('/api/users').send(userdata).expect(201)
  
  const loginResponse = await api.post('/api/login')
    .send({ username: userdata.username, password: userdata.password })
    .expect(200)
  
  return (loginResponse.body as LoginResponse).token
}

export const createAnotherUserAndGetToken = async (
  api: supertest.SuperTest<supertest.Test>
) => {
  const anotherUser = {
    username: `testuser-${Date.now()}`,
    name: "Another User",
    email: `another-${Date.now()}@mail.com`,
    password: "password123"
  }
  
  return await createAndLoginUser(api, anotherUser)
}
