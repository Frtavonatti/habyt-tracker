import { Router } from 'express'
import { tokenExtractor } from '../middleware/index.js'
import {
  // getAllHabyts,
  getHabyt,
  getUserHabyts,
  createNewHabyt,
  updateHabyt,
  deleteHabyt
} from '../controllers/habyts.controller.js'

const habytRouter = Router()
// habytRouter.get('/', getAllHabyts)

habytRouter.use(tokenExtractor)
habytRouter.get('/', getUserHabyts)
habytRouter.get('/:id', getHabyt)
habytRouter.post('/', createNewHabyt)
habytRouter.put('/:id', updateHabyt)
habytRouter.delete('/:id', deleteHabyt)

export default habytRouter
