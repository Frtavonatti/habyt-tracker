import type { Request, Response } from 'express'
import type { UserCreateBody, UsernameUpdateBody } from '../types/index.js'

import bcrypt from 'bcrypt'
import * as userService from '../services/user.service.js'
import { validateCreateUserBody, validateNewUserName, validateUniqueUserFields } from '../validators/user.validator.js'
import { ForbiddenError } from '../utils/errors.js'

export const getAllUsers = async (req: Request, res: Response) => {
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
  const { username, name, email, password } = req.body
  validateCreateUserBody(username, name, email, password)
  await validateUniqueUserFields({ username, email })

  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = await userService.createUser({ username, name, email, passwordHash })

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
  if (req.decodedToken?.id !== req.user?.id) throw new ForbiddenError('forbidden')

  const { newUsername } = req.body
  validateNewUserName(newUsername)
  await validateUniqueUserFields({ username: newUsername })
  
  req.user!.username = newUsername.trim()
  const updatedUser = await req.user!.save()
  return res.status(200).json(updatedUser)
}

export const deleteUserById = async (req: Request, res: Response) => {
  if (req.user?.id !== req.decodedToken?.id) throw new ForbiddenError('forbidden')
  await req.user!.destroy()
  return res.status(204).end()
}

export const deleteUserByUsername = async (req: Request, res: Response) => {
  if (req.user?.id !== req.decodedToken?.id) throw new ForbiddenError('forbidden')
  await req.user!.destroy()
  return res.status(204).end()
}