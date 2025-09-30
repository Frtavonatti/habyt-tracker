import Router from 'express'

import { User } from '../models/index.js'

const userRouter = Router()

userRouter.get('/', async (req, res) => {
  const users = await User.findAll()
  return res.json(users)
})

export default userRouter