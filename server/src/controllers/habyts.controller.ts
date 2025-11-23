import type { Request, Response } from 'express'
import type { HabytCreateBody, HabytUpdateBody } from '../../../shared/src/habyt.types.js'

import * as habytService from '../services/habyt.service.js'
import { findUserById } from '../services/user.service.js'
import { validateHabytTitle, validateHabytDescription } from '../validators/habyt.validator.js'

export const getAllHabyts = async (req: Request, res: Response) => {
  const habyts = await habytService.findAllHabyts()
  return res.json(habyts)
}

export const getHabyt = async (req: Request<{ id: string }>, res: Response) => {
  const habyt = await habytService.findHabytById(req.params.id)
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
  validateHabytTitle(req.body.title)
  validateHabytDescription(req.body.description)

  const user = await findUserById(req.decodedToken?.id as string | undefined)

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
  validateHabytTitle(req.body.title)
  validateHabytDescription(req.body.description)

  const user = await findUserById(req.decodedToken?.id as string | undefined)

  const result = await habytService.updateHabyt({ 
    id: req.params.id,
    title,
    description,
    userId: user.id
   })

  return res.json(result.habyt)
}

export const deleteHabyt = async (req: Request<{ id: string }>, res: Response) => {
  const user = await findUserById(req.decodedToken?.id as string | undefined)

  await habytService.deleteHabyt({
    id: req.params.id,
    userId: user.id
  })

  return res.status(204).end()
}