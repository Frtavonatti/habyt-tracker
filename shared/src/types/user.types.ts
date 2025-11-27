import type { z } from 'zod'
import type { 
  userCreateSchema, 
  usernameUpdateSchema, 
  loginSchema, 
  userSchema 
} from '../schemas/user.schema.js'

export type UserCreateBody = z.infer<typeof userCreateSchema>
export type UsernameUpdateBody = z.infer<typeof usernameUpdateSchema>
export type LoginBody = z.infer<typeof loginSchema>
export type UserResponse = z.infer<typeof userSchema>

// Services
export interface UserCreateData {
  username: string
  name: string
  passwordHash: string
  email: string
}

export interface LoginResponse {
  token: string
  username: string
  name: string
}