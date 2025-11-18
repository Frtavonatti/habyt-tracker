import User from "../models/user.js"
import type { FindUserResult, UserCreateData, CreateUserResult  } from "../types/user.types.js"

export const findAll = (): Promise<User[]> => {
  return User.findAll()
}

export const findUserById = async (
  id: string | undefined
): Promise<FindUserResult> => {
  if (!id) return { error: 'Missing id' }
  const user = await User.findByPk(id)
  if (!user) return { error: 'User not found' }
  return user
}

/* This can be also consider a validator */
export const validateUniqueUserFields = async (
  params: Partial<{username: string, email: string}>
): Promise<true | { error: string }> => {
  for (const [key, value] of Object.entries(params) ) {
    if (!value) continue
    const isMatching = await User.findOne({ where: { [key]: value } })
    if (isMatching)
      return { error: `${key} must be unique` }
  }
  return true
}

export const createUser = async (
  { username, name, email, passwordHash }: UserCreateData
): Promise<CreateUserResult> => {
  const newUser = await User.create({
    username: username.trim(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
  })
  if (!newUser) return { error: 'Error creating new user' }
  return newUser
}