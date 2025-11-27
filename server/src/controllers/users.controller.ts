import type { Request, Response } from 'express'
import type { UserCreateBody, UsernameUpdateBody } from '@shared/types/user.types.js'
import { userCreateSchema, usernameUpdateSchema } from '@shared/schemas/user.schema.js'

import bcrypt from 'bcrypt'
import * as userService from '../services/user.service.js'
import { validateUniqueUserFields } from '../validators/uniqueness.validator.js'
import { ForbiddenError } from '../utils/errors.js'

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await userService.findAll()
  return res.json(users)
}

export const getUserById = async (req: Request, res: Response) => {
  const result = await userService.findUserById(req.params.id)
  return res.json(result)
}

export const createNewUser = async (
  req: Request<unknown, unknown, UserCreateBody>, 
  res: Response
) => {
  const validatedData = userCreateSchema.parse(req.body)
  const { username, name, email, password } = validatedData
  await validateUniqueUserFields({ username, email })

  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = await userService.createUser({ 
    username, name, email, passwordHash 
  })

  return res.status(201).json({
    id: newUser.id,
    username: newUser.username,
    name: newUser.name,
    email: newUser.email
  })
}

export const changeUsername = async (
  req: Request<unknown, unknown, UsernameUpdateBody>,
  res: Response
) => {
  if (req.decodedToken?.id !== req.user?.id) 
    throw new ForbiddenError('forbidden')
  
  const validatedData = usernameUpdateSchema.parse(req.body) 
  const { newUsername } = validatedData
  await validateUniqueUserFields({ username: newUsername })
  
  req.user!.username = newUsername.trim()
  const updatedUser = await req.user!.save()
  return res.status(200).json(updatedUser)
}

export const deleteUserById = async (req: Request, res: Response) => {
  if (req.user?.id !== req.decodedToken?.id) 
    throw new ForbiddenError('forbidden')
  await req.user!.destroy()
  return res.status(204).end()
}

export const deleteUserByUsername = async (req: Request, res: Response) => {
  if (req.user?.id !== req.decodedToken?.id) 
    throw new ForbiddenError('forbidden')
  await req.user!.destroy()
  return res.status(204).end()
}