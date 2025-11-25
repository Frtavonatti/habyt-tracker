import Habyt from "../models/habyt.js"
import { ForbiddenError, NotFoundError } from "../utils/errors.js"

import type { 
  HabytCreateData, 
  HabytUpdateData, 
  HabytUpdateResult, 
  Habyt as HabytDTO
} from "@shared/types/habyt.types.js"

export const findAllHabyts = async (): Promise<HabytDTO[]> => {
  const habyts = await Habyt.findAll()
  return habyts.map(h => h.toJSON())
}

export const findHabytById = async (id: string): Promise<HabytDTO> => {
  const habyt = await Habyt.findByPk(id)
  if (!habyt) throw new NotFoundError('Habyt not Found')
  return habyt.toJSON()
}

export const createHabyt = async (
  { title, description, userId }: HabytCreateData
): Promise<HabytDTO> =>  {
  const habyt = await Habyt.create({ title, description, userId })
  return habyt.toJSON()
}

export const updateHabyt = async (
  { id, title, description, userId }: HabytUpdateData)
  : Promise<HabytUpdateResult> => {
  const habyt = await Habyt.findByPk(id)
  if (!habyt) throw new NotFoundError('Habyt not found')
  if (habyt.userId !== userId) throw new ForbiddenError('Forbidden')
  
  await habyt.update({ title, description })
  return { habyt: habyt.toJSON() }
}

export const deleteHabyt = async (
  { id, userId }: { id: string, userId: string }
): Promise<{ success: true }> => {
  const habyt = await Habyt.findByPk(id)
  if (!habyt) throw new NotFoundError('Habyt not found')
  if (habyt.userId !== userId) throw new ForbiddenError('Forbidden')

  await habyt.destroy()
  return { success: true }
}
