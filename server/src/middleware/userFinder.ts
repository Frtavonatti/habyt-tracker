import type { RequestHandler } from 'express'
import { User } from '../models/index.js'

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