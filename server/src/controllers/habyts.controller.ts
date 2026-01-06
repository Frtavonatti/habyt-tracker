import type { Request, Response } from 'express'
import type { HabytCreateBody, HabytUpdateBody, HabytUpdateData } from '@shared/types/habyt.types.js'
import { habytCreateSchema, habytUpdateSchema } from '@shared/schemas/habyt.schema.js'

import * as habytService from '../services/habyt.service.js'
import { findUserById } from '../services/user.service.js'

/* export const getAllHabyts = async (_req: Request, res: Response) => {
  const habyts = await habytService.findAllHabyts()
  return res.json(habyts)
} */

export const getUserHabyts = async (req: Request, res: Response) => {
  const user = await findUserById(req.decodedToken?.id as string)
  const userHabyts = await habytService.findUserHabyts(user.id)
  return res.json(userHabyts)
}

export const getHabyt = async (req: Request<{ id: string }>, res: Response) => {
  const user = await findUserById(req.decodedToken?.id as string)
  const habyt = await habytService.findHabytById(user.id, req.params.id)
  return res.json(habyt)
}

export const createNewHabyt = async (
  req: Request<unknown, unknown, HabytCreateBody>,
  res: Response
) => {
  const validatedData = habytCreateSchema.parse(req.body)
  const { title, description } = validatedData

  const user = await findUserById(req.decodedToken?.id as string)

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

  const user = await findUserById(req.decodedToken?.id as string)

  const updateData: HabytUpdateData = {
    id: req.params.id,
    userId: user.id
  }

  if (validatedData.title !== undefined)
    updateData.title = validatedData.title
  if (validatedData.description !== undefined)
    updateData.description = validatedData.description

  const updatedHabyt = await habytService.updateHabyt(updateData)

  return res.json(updatedHabyt)
}

export const deleteHabyt = async (req: Request<{ id: string }>, res: Response) => {
  const user = await findUserById(req.decodedToken?.id as string)

  await habytService.deleteHabyt({
    id: req.params.id,
    userId: user.id
  })

  return res.status(204).end()
}
