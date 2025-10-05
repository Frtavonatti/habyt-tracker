import { Router } from 'express'
import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'

import { User } from '../models/index.js'
import { tokenExtractor, findByUsername, findByPk } from '../middleware/index.js'
import type { CreateUserBody, UpdateUsernameBody } from '../types/index.js'

const userRouter = Router()

userRouter.get('/', async (req, res) => {
  const users = await User.findAll()
  return res.json(users)
})

userRouter.get('/:id', async (req, res) => {
  // Replace with userFinder middleware
  const user = await User.findByPk(req.params.id,  { rejectOnEmpty: false })
  if (!user)
    return res.status(404).json({ error: 'User not found' })
  
  return res.json(user)
})

userRouter.post('/', async (
  req: Request<unknown, unknown, CreateUserBody>, 
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

  const existing = await User.findOne({ where: { username } })
  if (existing) {
    return res.status(400).json({ error: 'Username must be unique' })
  }

  const existingEmail = await User.findOne({ where: { email } })
  if (existingEmail) {
    return res.status(400).json({ error: 'Email must be unique' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = await User.create({
    username: username.trim(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash
  })

  return res.status(201).json({
    id: newUser.id,
    username: newUser.username,
    name: newUser.name,
    email: newUser.email
  })
})

userRouter.put('/:username', tokenExtractor, findByUsername, async (
  req: Request<unknown, unknown, UpdateUsernameBody>,
  res: Response
) => {
  if (req.decodedToken?.id !== req.user?.id)
    return res.status(403).json({ error: 'forbidden' })

  const { newUsername } = req.body
  if (!newUsername || typeof newUsername !== 'string' || newUsername.trim() === '')
    return res.status(400).json({ error: 'New username is required' })

  const existing = await User.findOne({ where: { username: newUsername } })
  if (existing && existing.id !== req.user!.id)
    return res.status(400).json({ error: 'Username must be unique' })
  
  req.user!.username = newUsername.trim()
  const updatedUser = await req.user!.save()
  return res.status(200).json(updatedUser)
})

userRouter.delete('/:id', tokenExtractor, findByPk, async (req, res) => {
  if (req.user?.id !== req.decodedToken?.id)
    return res.status(403).json({ error: 'forbidden' })

  await req.user!.destroy()
  return res.status(204).end()
})

userRouter.delete('/username/:username', tokenExtractor, findByUsername, async (req, res) => {
  if (req.user?.id !== req.decodedToken?.id)
    return res.status(403).json({ error: 'forbidden' })

  await req.user!.destroy()
  return res.status(204).end()
})

export default userRouter