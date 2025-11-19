import User from "../models/user.js"
import { ValidationError } from "../utils/errors.js"

export const validateUniqueUserFields = async (
  params: Partial<{username: string, email: string}>
): Promise<true | { error: string }> => {
  for (const [key, value] of Object.entries(params) ) {
    if (!value) continue
    const isMatching = await User.findOne({ where: { [key]: value } })
    if (isMatching) throw new ValidationError(`${key} must be unique`)
  }
  return true
}

export const validateUsername = (username: unknown) => {
  if (!username || typeof username != 'string' || username.trim() === '')
    throw new ValidationError('Username is required')
}

export const validatePassword = (password: unknown) => {
  if (!password || typeof password !== 'string' || password.length < 6)
    throw new ValidationError('Password must be at least 6 chars')
}

export const validateCreateUserBody = (
  username: unknown, 
  name: unknown, 
  email:unknown, 
  password:unknown
) => {
  validateUsername(username)
  validatePassword(password)
  if (!name || typeof name !== 'string' || name.trim() === '')
    throw new ValidationError('Name is required')
  if (!email || typeof email !== 'string' || email.trim() === '')
    throw new ValidationError('Email is required')
}

export const validateNewUserName = (newUsername: unknown) => {
  if (!newUsername || typeof newUsername !== 'string' || newUsername.trim() === '')
    throw new ValidationError('New username is required')
}