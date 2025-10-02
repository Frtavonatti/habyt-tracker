import { Router } from 'express'
import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { User } from '../models/index.js'
import { JWT_SECRET } from '../utils/config.js'

const loginRouter = Router()

interface LoginBody {
  username: string
  password: string
}

interface AuthTokenPayload {
  id: string
  username: string
}

loginRouter.post('/', async (req: Request<unknown, unknown, LoginBody>, res: Response) => {
  const { username, password } = req.body

  if (!username || typeof username != 'string' || username.trim() === '')
    return res.status(400).json({ error: 'Username is required' })
  if (!password || typeof password != 'string' || password.trim() === '')
    return res.status(400).json({ error: 'Password is required' })

  const user = await User.findOne({ where: { username } })
  if (!user)
    return res.status(401).json({ error: 'Invalid username or password' })

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!passwordCorrect)
    return res.status(401).json({ error: 'Invalid username or password' })

  if (typeof JWT_SECRET !== 'string' || JWT_SECRET.length === 0)
    return res.status(500).json({ error: 'JWT secret not configured' })

  const payload: AuthTokenPayload = {
    id: String(user.id),
    username: user.username,
  }
  
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })

  return res.status(200).send({ 
    token, 
    username: user.username, 
    name: user.name 
  })
})

export default loginRouter