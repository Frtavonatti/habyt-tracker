import Router from 'express'
import type { Request, Response } from 'express'

import { Habyt } from '../models/index.js'

const habytRouter = Router()

interface CreateHabytBody {
  title: string
  description?: string | null
}

habytRouter.get('/', async (req, res) => {
  const habyts = await Habyt.findAll()
  return res.json(habyts)
})

habytRouter.post('/', async (req: Request<unknown, unknown, CreateHabytBody>, res: Response) => { // Add authentication middleware to get userId from token
  const { title, description }: {
    title: string,
    description?: string | null
  } = req.body

  if (!title || typeof title != 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' })
  }

  if (description !== undefined && description !== null && typeof description != 'string') {
    return res.status(400).json({ error: 'Description must be a string' })
  }

  const normalizedDescription =
  typeof description === 'string'
    ? (description.trim() === '' ? null : description.trim())
    : null
  
  const newHabyt = await Habyt.create({ 
    title, 
    description: normalizedDescription,
    userId: 'some-user-id' // Replace with actual user ID from authentication 
  })

  return res.status(201).json(newHabyt)
})

habytRouter.delete('/:id', async (req, res) => { // Add authentication middleware to validate user is the owner
  const habyt = await Habyt.findByPk(req.params.id)
  if (!habyt) {
    return res.status(404).json({ error: 'Habyt not found' })
  }
  await habyt.destroy()
  return res.status(204).json({ message: `Habyt ${req.params.id} deleted successfully` })
})

export default habytRouter