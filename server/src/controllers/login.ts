import Router from 'express'
import * as jwt from 'jsonwebtoken'

import { User } from '../models/index.js'
import { JWT_SECRET } from '../utils/config.js'

const loginRouter = Router()

interface AuthTokenPayload {
  id: string
  username: string
}

loginRouter.post('/', async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { username, password } = req.body

  if (!username || typeof username != 'string' || username.trim() === '') {
    return res.status(400).json({ error: 'Username is required' })
  }

  if (!password || typeof password != 'string' || password.trim() === '') {
    return res.status(400).json({ error: 'Password is required' })
  }

  const user = await User.findOne({ where: { username } })
  const passwordCorrect = password === 'secret' // for demonstrations only

  if (!user || !passwordCorrect) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ error: 'JWT secret not configured' })
  }

  const payload: AuthTokenPayload = {
    id: String(user.id),
    username: user.username,
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const token: string = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })

  return res.status(200).send({ 
    token, 
    username: user.username, 
    name: user.name 
  })
})

export default loginRouter