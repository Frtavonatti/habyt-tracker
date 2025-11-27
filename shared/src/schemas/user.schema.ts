import { z } from "zod"

export const userCreateSchema = z.object({
  username: z.string().min(1, 'Username is required').trim(),
  name: z.string().min(1, 'Name is required').trim(),
  email: z.email('Invalid email format').trim(),
  password: z.string().min(6, 'Password must be at least 6 chars')
})

export const usernameUpdateSchema = z.object({
  newUsername: z.string().min(1, 'New username is required').trim()
})

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').trim(),
  password: z.string().min(1, 'Password is required')
})

export const userSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  name: z.string(),
  email: z.email()
})