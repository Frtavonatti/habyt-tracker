import type { Request, Response } from 'express'

import * as habytService from '../services/habyt.service.js'
import { findUserById } from '../services/user.service.js'
import type { HabytCreateBody, HabytUpdateBody } from '../types/index.js'

export const getAllHabyts = async (req: Request, res: Response) => {
  const habyts = await habytService.findAllHabyts()
  return res.json(habyts)
}

export const getHabyt = async (req: Request<{ id: string }>, res: Response) => {
  const habyt = await habytService.findHabytById(req.params.id)
  if ('error' in habyt)
    return res.status(404).json({ error: habyt.error })
  return res.json(habyt)
}

export const createNewHabyt = async (
  req: Request<unknown, unknown, HabytCreateBody>,
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

  const user = await findUserById(req.decodedToken?.id as string | undefined)
  if ('error' in user)
    return res.status(user.error === 'Missing id' ? 400 : 404).json({ error: user.error })

  const normalizedDescription =
  typeof description === 'string'
    ? (description.trim() === '' ? null : description.trim())
    : null
  
  const newHabyt = await habytService.createHabyt({ 
    title, 
    description: normalizedDescription,
    userId: user.id
  })

  return res.status(201).json(newHabyt)
}

export const updateHabyt = async (
  req: Request<{ id: string }, unknown, HabytUpdateBody>, 
  res: Response
) => {
  const { title, description } = req.body
  if (!title || typeof title != 'string' || title.trim() === '')
    return res.status(400).json({ error: 'Title is required' })

  if (description !== null && typeof description != 'string')
    return res.status(400).json({ error: 'Description must be a string or null' })

  const user = await findUserById(req.decodedToken?.id as string | undefined)
  if ('error' in user)
    return res.status(user.error === 'Missing id' ? 400 : 404).json({ error: user.error })

  const result = await habytService.updateHabyt({ 
    id: req.params.id,
    title,
    description,
    userId: user.id
   })
  
  if ('error' in result) {
    switch (result.error) {
      case 'Habyt not found':
        return res.status(404).json({ error: result.error })
      case 'Forbidden':
        return res.status(403).json({ error: 'Forbidden: You can only update your own habyts' })
      default:
        return res.status(400).json({ error: result.error })
    }
  }

  return res.json(result.habyt)
}

export const deleteHabyt = async (req: Request<{ id: string }>, res: Response) => {
  const user = await findUserById(req.decodedToken?.id as string | undefined)
  if ('error' in user)
    return res.status(user.error === 'Missing id' ? 400 : 404).json({ error: user.error })

  const result = await habytService.deleteHabyt({
    id: req.params.id,
    userId: user.id
  })

  if ('error' in result) {
    switch (result.error) {
      case 'Habyt not found':
        return res.status(404).json({ error: result.error })
      case 'Forbidden':
        return res.status(403).json({ error: 'Forbidden: You can only delete your own habyts' })
      default:
        return res.status(400).json({ error: result.error })
    }
  }

  return res.status(204).end()
}