import type supertest from "supertest"
import bcrypt from "bcrypt"
import type { LoginResponse } from "../../../shared/src/index.js"
import { User } from "../../src/models/index.js"

// ============================================
// LOW-LEVEL HELPERS (Single Responsibility)
// ============================================

/**
 * Creates a user via API endpoint
 */
export const createUserViaAPI = async (
  api: ReturnType<typeof supertest>,
  userdata: { username: string; name: string; email: string; password: string }
) => {
  await api.post('/api/users').send(userdata).expect(201)
}

/**
 * Logs in a user and returns the auth token
 */
export const loginUser = async (
  api: ReturnType<typeof supertest>,
  credentials: { username: string; password: string }
) => {
  const loginResponse = await api.post('/api/login')
    .send(credentials)
    .expect(200)
  
  return (loginResponse.body as LoginResponse).token
}

/**
 * Creates a user directly in the database (bypassing API validation)
 * Useful for test setup
 */
export const createUserInDB = async (
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

/**
 * Generates unique user data for creating additional test users
 */
export const generateUniqueUserData = () => ({
  username: `testuser-${Date.now()}`,
  name: "Another User",
  email: `another-${Date.now()}@mail.com`,
  password: "password123"
})

// ============================================
// HIGH-LEVEL COMPOSED HELPERS (Common Use Cases)
// ============================================

/**
 * Creates a user via API and logs them in - returns the auth token
 * Composed helper for the common pattern of creating and logging in a user
 */
export const createAndLoginUser = async (
  api: ReturnType<typeof supertest>,
  userdata: { username: string; name: string; email: string; password: string }
) => {
  await createUserViaAPI(api, userdata)
  return await loginUser(api, { username: userdata.username, password: userdata.password })
}

/**
 * Creates a unique user, registers them via API, and returns their auth token
 * Composed helper for testing with additional users (e.g., testing authorization)
 */
export const createAnotherUserAndGetToken = async (
  api: ReturnType<typeof supertest>
) => {
  const anotherUser = generateUniqueUserData()
  await createUserViaAPI(api, anotherUser)
  return await loginUser(api, { username: anotherUser.username, password: anotherUser.password })
}
