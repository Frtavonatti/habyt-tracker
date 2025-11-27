import Habyt from "../models/habyt.js"
import { ForbiddenError, NotFoundError } from "../utils/errors.js"

import type { 
  HabytCreateData, 
  HabytUpdateData, 
  Habyt as HabytDTO
} from "@shared/types/habyt.types.js"

export const findAllHabyts = async (): Promise<HabytDTO[]> => {
  return await Habyt.findAll()
}

export const findHabytById = async (id: string): Promise<HabytDTO> => {
  const habyt = await Habyt.findByPk(id)
  if (!habyt) throw new NotFoundError('Habyt not Found')
  return habyt
}

export const createHabyt = async (
  { title, description, userId }: HabytCreateData
): Promise<HabytDTO> =>  {
  return await Habyt.create({ title, description, userId })
}

export const updateHabyt = async (
  { id, title, description, userId }: HabytUpdateData)
  : Promise<HabytDTO> => {
  const habyt = await Habyt.findByPk(id)
  
  if (!habyt) 
    throw new NotFoundError('Habyt not found')
  if (habyt.userId !== userId) 
    throw new ForbiddenError('Forbidden')
  
  return await habyt.update({ title, description })
}

export const deleteHabyt = async (
  { id, userId }: { id: string, userId: string }
): Promise<void> => {
  const habyt = await Habyt.findByPk(id)

  if (!habyt) 
    throw new NotFoundError('Habyt not found')
  if (habyt.userId !== userId) 
    throw new ForbiddenError('Forbidden')

  await habyt.destroy()
}
