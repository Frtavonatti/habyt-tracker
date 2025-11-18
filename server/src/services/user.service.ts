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