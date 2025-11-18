import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'

import * as userService from '../services/user.service.js'
import type { UserCreateBody, UsernameUpdateBody } from '../types/index.js'

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await userService.findAll()
  return res.json(users)
}

export const getUserById = async (req: Request, res: Response) => {
  const result = await userService.findUserById(req.params.id)
  if ('error' in result)
    return res.status(result.error === 'Missing id' ? 400 : 404).json({ error : result.error })
  
  return res.json(result)
}

export const createNewUser = async (
  req: Request<unknown, unknown, UserCreateBody>, 
  res: Response
) => {
  const { username, name, email, password } = req.body

  if (!username || typeof username !== 'string' || username.trim() === '')
    return res.status(400).json({ error: 'Username is required' })
  if (!name || typeof name !== 'string' || name.trim() === '')
    return res.status(400).json({ error: 'Name is required' })
  if (!email || typeof email !== 'string' || email.trim() === '')
    return res.status(400).json({ error: 'Email is required' })
  if (!password || typeof password !== 'string' || password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 chars' })

  const uniqueCheck = await userService.validateUniqueUserFields({ username, email })
  if (uniqueCheck !== true)
    return res.status(400).json({ error: uniqueCheck.error })

  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = await userService.createUser({ username, name, email, passwordHash })
  if ('error' in newUser)
    return res.status(500).json({ error: newUser.error })

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
    return res.status(403).json({ error: 'forbidden' })

  const { newUsername } = req.body
  if (!newUsername || typeof newUsername !== 'string' || newUsername.trim() === '')
    return res.status(400).json({ error: 'New username is required' })

  const uniqueCheck = await userService.validateUniqueUserFields({ username: newUsername })
  if (uniqueCheck !== true)
    return res.status(400).json({ error: uniqueCheck.error })
  
  req.user!.username = newUsername.trim()
  const updatedUser = await req.user!.save()
  return res.status(200).json(updatedUser)
}

export const deleteUserById = async (req: Request, res: Response) => {
  if (req.user?.id !== req.decodedToken?.id)
    return res.status(403).json({ error: 'forbidden' })

  await req.user!.destroy()
  return res.status(204).end()
}

export const deleteUserByUsername = async (req: Request, res: Response) => {
  if (req.user?.id !== req.decodedToken?.id)
    return res.status(403).json({ error: 'forbidden' })

  await req.user!.destroy()
  return res.status(204).end()
}