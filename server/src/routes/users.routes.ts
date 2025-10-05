import { Router } from 'express'
import { tokenExtractor, findByPk, findByUsername } from '../middleware/index.js'
import { 
  getAllUsers,
  getUserById,
  createNewUser,
  changeUsername,
  deleteUserById,
  deleteUserByUsername
} from '../controllers/users.controller.js'

const userRouter = Router()

userRouter.get('/', getAllUsers)
userRouter.get('/:id', getUserById)
userRouter.post('/', createNewUser)
userRouter.put('/:username', tokenExtractor, findByUsername, changeUsername)
userRouter.delete('/:id', tokenExtractor, findByPk, deleteUserById)
userRouter.delete('/username/:username', tokenExtractor, findByUsername, deleteUserByUsername)

export default userRouter