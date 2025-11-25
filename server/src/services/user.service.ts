import User from "../models/user.js"
import { NotFoundError, BadRequestError, AppError } from "../utils/errors.js"
import type { UserCreateData, UserResponse  } from "../../../shared/src/types/user.types.js"

export const findAll = (): Promise<User[]> => {
  return User.findAll()
}

export const findUserById = async (
  id: string | undefined
): Promise<User> => {
  if (!id) throw new BadRequestError('Missing id')
  const user = await User.findByPk(id)
  if (!user) throw new NotFoundError('User not found')
  return user
}

export const createUser = async (
  { username, name, email, passwordHash }: UserCreateData
): Promise<UserResponse> => {
  const newUser = await User.create({
    username: username.trim(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
  })
  if (!newUser) throw new AppError('Error creating new user', 500)
  return newUser
}