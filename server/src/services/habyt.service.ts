import Habyt from "../models/habyt.js"

import type { HabytCreateData, HabytUpdateData, HabytUpdateResult } from "../types/habyt.types.js"

export const findAllHabyts = (): Promise<Habyt[]> => {
  return Habyt.findAll()
}

export const findHabytById = async (id: string): Promise<Habyt | { error: string }> => {
  const habyt = await Habyt.findByPk(id)
  if (!habyt) return { error: 'Habyt not Found' }
  return habyt
}

export const createHabyt = (
  { title, description, userId }: HabytCreateData
): Promise<Habyt> =>  {
  return Habyt.create({ title, description, userId })
}

export const updateHabyt = async (
  { id, title, description, userId }: HabytUpdateData)
  : Promise<HabytUpdateResult> => {
  const habyt = await Habyt.findByPk(id)
  if (!habyt) return { error: 'Habyt not found' }
  if (habyt.userId !== userId) return { error: 'Forbidden' }
  const updated = await habyt.update({ title, description })
  return { habyt: updated }
}

export const deleteHabyt = async (
  { id, userId }: { id: string, userId: string }
): Promise<{ success: true } | { error: string }> => {
  const habyt = await Habyt.findByPk(id)
  if (!habyt) return { error: 'Habyt not found' }
  if (habyt.userId !== userId) return { error: 'Forbidden' }
  await habyt.destroy()
  return { success: true }
}
