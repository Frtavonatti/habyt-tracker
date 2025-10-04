import { Router } from 'express'
import type { Request, Response } from 'express'

import { Habyt, User } from '../models/index.js'
import { tokenExtractor } from '../utils/middleware.js'
import type { CreateHabytBody } from '../types/habyt.types.js'

const habytRouter = Router()

habytRouter.get('/', async (req, res) => {
  const habyts = await Habyt.findAll()
  return res.json(habyts)
})

habytRouter.get('/:id', async (req, res) => {
  const habyt = await Habyt.findByPk(req.params.id)
  return res.json(habyt)
})

habytRouter.post('/', tokenExtractor, async (
  req: Request<unknown, unknown, CreateHabytBody>,
  res: Response
) => {
  const { title, description }: {
    title: string,
    description?: string | null
  } = req.body

  if (!title || typeof title != 'string' || title.trim() === '')
    return res.status(400).json({ error: 'Title is required' })

  if (description !== undefined && description !== null && typeof description != 'string')
    return res.status(400).json({ error: 'Description must be a string' })

  const user = await User.findByPk(req.decodedToken?.id as string | undefined)
  if (!user)
    return res.status(401).json({ error: 'User not found' })

  const normalizedDescription =
  typeof description === 'string'
    ? (description.trim() === '' ? null : description.trim())
    : null
  
  const newHabyt = await Habyt.create({ 
    title, 
    description: normalizedDescription,
    userId: user.id
  })

  return res.status(201).json(newHabyt)
})

habytRouter.delete('/:id', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken?.id as string | undefined)
  if (!user) {
    return res.status(401).json({ error: 'User not found' })
  }

  const habyt = await Habyt.findByPk(req.params.id)
  if (!habyt)
    return res.status(404).json({ error: 'Habyt not found' })
  if (habyt.userId !== user.id)
    return res.status(403).json({ error: 'Forbidden: You can only delete your own Habyts' })

  await habyt.destroy()
  return res.status(204).end()
})

export default habytRouter