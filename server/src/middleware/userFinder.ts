import type { Request, RequestHandler } from 'express'
import { User } from '../models/index.js'

const userFinder = (findFn: (req: Request) => Promise<User | null>): RequestHandler => 
  async (req, res, next) => {
    try {
      const user = await findFn(req)
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

export const findByPk = userFinder(req => User.findByPk(req.params.id))

export const findByUsername = userFinder(req => User.findOne({ 
  where: { username: req.params.username } 
}))

export const findByDecodedTokenId = userFinder(req => 
  User.findByPk(req.decodedToken?.id as string | undefined)
)