import type { Request, Response } from 'express'
import { habytCreateSchema, habytUpdateSchema } from '@shared/schemas/habyt.schema.js'
import type { HabytCreateBody, HabytUpdateBody } from '@shared/types/habyt.types.js'

import * as habytService from '../services/habyt.service.js'
import { findUserById } from '../services/user.service.js'

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
  const validatedData = habytCreateSchema.parse(req.body)
  const { title, description } = validatedData

  const user = await findUserById(req.decodedToken?.id as string | undefined)
  
  const newHabyt = await habytService.createHabyt({ 
    title, 
    description: description ?? null,
    userId: user.id
  })

  return res.status(201).json(newHabyt)
}

export const updateHabyt = async (
  req: Request<{ id: string }, unknown, HabytUpdateBody>, 
  res: Response
) => {
  const validatedData = habytUpdateSchema.parse(req.body)
  const { title, description } = validatedData

  const user = await findUserById(req.decodedToken?.id as string | undefined)

  const result = await habytService.updateHabyt({ 
    id: req.params.id,
    title,
    description: description ?? null,
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