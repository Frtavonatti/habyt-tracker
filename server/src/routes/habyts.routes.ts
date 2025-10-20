import { Router } from 'express'
import { tokenExtractor } from '../middleware/index.js'
import { 
  getAllHabyts,
  getHabyt,
  createNewHabyt,
  updateHabyt,
  deleteHabyt
} from '../controllers/habyts.controller.js'

const habytRouter = Router()

habytRouter.get('/', getAllHabyts)
habytRouter.get('/:id', getHabyt)
habytRouter.post('/', tokenExtractor, createNewHabyt)
habytRouter.put('/:id', tokenExtractor, updateHabyt)
habytRouter.delete('/:id', tokenExtractor, deleteHabyt)

export default habytRouter