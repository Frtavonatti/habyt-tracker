import type User from "../models/user.js"

export interface UserCreateBody {
  username: string
  name: string
  password: string
  email: string
}

export interface UserCreateData {
  username: string
  name: string
  passwordHash: string
  email: string
}

export interface UsernameUpdateBody {
  newUsername: string
}

export interface LoginBody {
  username: string
  password: string
}

export interface UserResponse {
  id: string
  username: string
  name: string
  email: string
}

export interface LoginResponse {
  token: string
  username: string
  name: string
}

// Services
export type FindUserResult = User | { error: string }
export type CreateUserResult = UserResponse | { error: string }