import { Router } from 'express'
import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'

import { User } from '../models/index.js'

const userRouter = Router()

interface CreateUserBody {
  username: string
  name: string
  email: string
  password: string
}

userRouter.get('/', async (req, res) => {
  const users = await User.findAll()
  return res.json(users)
})

userRouter.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  return res.json(user)
})

userRouter.post('/', async (req: Request<unknown, unknown, CreateUserBody>, res: Response) => {
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

userRouter.delete('/:id', async (req, res) => { // TODO: add auth middleware (only admin and the user itself can delete the user)
  const user = await User.findByPk(req.params.id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  await user.destroy()
  return res.status(204).end()
})

export default userRouter