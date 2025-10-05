import { Router } from 'express'
import { tokenExtractor } from '../middleware/auth.js'
import { 
  getAllHabyts,
  getHabyt,
  createNewHabyt,
  deleteHabyt
} from '../controllers/habyts.controller.js'

const habytRouter = Router()

habytRouter.get('/', getAllHabyts)
habytRouter.get('/:id', getHabyt)
habytRouter.post('/', tokenExtractor, createNewHabyt)
habytRouter.delete('/:id', tokenExtractor, deleteHabyt)

export default habytRouter