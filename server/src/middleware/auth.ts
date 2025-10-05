import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import type { User } from '../models/index.js'
import { JWT_SECRET } from '../config/index.js'

declare module 'express-serve-static-core' {
  interface Request {
    user?: User | null
    token?: string | null
    decodedToken?: jwt.JwtPayload | null
  }
}

export const tokenExtractor = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const authorization = req.get('authorization')
  if (!authorization?.toLowerCase().startsWith('bearer ')) {
    req.token = null
    req.decodedToken = null
    return res.status(401).json({ error: 'token missing' })
  }

  const token = authorization.substring(7)
  req.token = token

  const decoded = jwt.verify(token, JWT_SECRET)
  if (typeof decoded === 'object' && decoded && 'id' in decoded) {
    req.decodedToken = decoded
    return next()
  } else {
    req.decodedToken = null
    return res.status(401).json({ error: 'invalid token' })
  }
}