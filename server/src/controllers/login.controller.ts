import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { User } from '../models/index.js'
// import { validateUsername, validatePassword } from '../validators/user.validator.js'
import { AppError } from '../utils/errors.js'
import { JWT_SECRET } from '../config/index.js'

import type { LoginBody, AuthTokenPayload } from '@shared'

export const login = async (
  req: Request<unknown, unknown, LoginBody>,
  res: Response
) => {
  const { username, password } = req.body
  // validateUsername(username)
  // validatePassword(password)

  const user = await User.scope('withPassword').findOne({ where: { username } })

  const passwordCorrect = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false

  if (!passwordCorrect || !user) throw new AppError('Invalid username or password', 401)

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
}