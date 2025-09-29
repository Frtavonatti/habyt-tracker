import Router from 'express'

import { Habyt} from '../models/index.js'

const habytRouter = Router()

habytRouter.get('/', async (req, res) => {
  const habyts = await Habyt.findAll()
  res.json(habyts)
})

export default habytRouter