import type { Request, Response, NextFunction, RequestHandler } from 'express'
import 'express-serve-static-core'
import jwt from 'jsonwebtoken'

import { User } from '../models/index.js'
import { JWT_SECRET } from './config.js'

declare module 'express-serve-static-core' {
  interface Request {
    user?: User | null
    token?: string | null
    decodedToken?: jwt.JwtPayload | null
  }
}

export const tokenExtractor = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.get('authorization')
  if (!authorization || authorization.toLowerCase().startsWith('bearer ')) {
    req.token = null
    req.decodedToken = null
    return next()
  }

  const token = authorization.substring(7)
  req.token = token

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (typeof decoded === 'object' && decoded && 'id' in decoded) {
    req.decodedToken = decoded
    return next()
    } else {
      req.decodedToken = null
      return res.status(401).json({ error: 'invalid token' })
    }
  } catch {
    req.decodedToken = null
    return res.status(401).json({ error: 'invalid token' })
  }
}

export const userFinder: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) {
      req.user = null
      return res.status(404).json({ error: 'User not found' })
    }
    req.user = user
    return next()
  } catch (err) {
    return next(err)
  }
}