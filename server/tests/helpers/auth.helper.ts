import type supertest from "supertest"
import bcrypt from "bcrypt"
import { randomUUID } from "node:crypto"
import type { LoginResponse } from "../../../shared/src/index.js"
import { User } from "../../src/models/index.js"

/**
 * In-memory cache for bcrypt password hashes.
 * Avoids redundant expensive bcrypt.hash() calls during test runs.
 * The cache should be cleared after each test to prevent stale hashes.
 */
const PASSWORD_HASH_CACHE = new Map<string, string>()

/** Clears the in-memory password hash cache (should be called in afterEach hook) */
export const clearPasswordHashCache = () => {
  PASSWORD_HASH_CACHE.clear()
}

// ============================================
// LOW-LEVEL HELPERS (Single Responsibility)
// ============================================

/** Creates a user via API endpoint */
export const createUserViaAPI = async (
  api: ReturnType<typeof supertest>,
  userdata: { username: string; name: string; email: string; password: string }
) => {
  await api.post('/api/users').send(userdata).expect(201)
}

/** Logs in a user and returns the auth token */
export const loginUser = async (
  api: ReturnType<typeof supertest>,
  credentials: { username: string; password: string }
) => {
  const loginResponse = await api.post('/api/login')
    .send(credentials)
    .expect(200)

  return (loginResponse.body as LoginResponse).token
}

/** Creates a user directly in the database (bypasses API validation, uses cached bcrypt hashes for performance) */
export const createUserInDB = async (
  userdata: { username: string; name: string; email: string; password: string }
) => {
  // Check cache first
  let passwordHash = PASSWORD_HASH_CACHE.get(userdata.password)

  if (!passwordHash) {
    // Cache miss - compute and store
    passwordHash = await bcrypt.hash(userdata.password, 10)
    PASSWORD_HASH_CACHE.set(userdata.password, passwordHash)
  }

  return await User.create({
    username: userdata.username,
    name: userdata.name,
    email: userdata.email,
    passwordHash
  })
}

/** Generates unique user data using randomUUID() to ensure uniqueness even in fast test execution */
export const generateUniqueUserData = () => {
  const uniqueId = randomUUID()
  return {
    username: `testuser-${uniqueId}`,
    name: "Another User",
    email: `another-${uniqueId}@mail.com`,
    password: "password123"
  }
}

// ============================================
// HIGH-LEVEL COMPOSED HELPERS (Common Use Cases)
// ============================================

/** Creates a user via API and logs them in, returns the auth token */
export const createAndLoginUser = async (
  api: ReturnType<typeof supertest>,
  userdata: { username: string; name: string; email: string; password: string }
) => {
  await createUserViaAPI(api, userdata)
  return await loginUser(api, { username: userdata.username, password: userdata.password })
}

/** Creates a unique user, registers them via API, and returns their auth token (useful for testing authorization) */
export const createAnotherUserAndGetToken = async (
  api: ReturnType<typeof supertest>
) => {
  const anotherUser = generateUniqueUserData()
  await createUserViaAPI(api, anotherUser)
  return await loginUser(api, { username: anotherUser.username, password: anotherUser.password })
}
