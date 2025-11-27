import Entry from "../models/entry.js"
import { NotFoundError, AppError } from "../utils/errors.js"
import type { EntryCreateData, Entry as EntryDTO } from "@shared/types/entry.types.js"

export const findAll = async (habytId: string): Promise<EntryDTO[]> => {
  return await Entry.findAll({
    where: { habytId },
    order: [['date', 'DESC']] 
  })
}

export const findEntryById = async (id: string): Promise<EntryDTO> => {
  const entry = await Entry.findByPk(id)
  if (!entry) throw new NotFoundError('Entry not found')
  return entry
}

export const createEntry = async (
  { date, completed = false, timeSpentMinutes = null, habytId }: EntryCreateData
): Promise<EntryDTO> => {
  try {
    return await Entry.create({ date, completed, timeSpentMinutes, habytId })
  } catch (error: unknown) {
      if ((error as { name: string }).name === "SequelizeUniqueConstraintError")
        throw new AppError('Entry for this date already exists', 409)
    throw error
  }
}

export const updateEntry = async (
  id: string, 
  completed: boolean, 
  timeSpentMinutes: number | null
): Promise<EntryDTO> => {
  const entry = await Entry.findByPk(id)
  if (!entry) throw new NotFoundError('Entry not found') 

  return await entry.update({ completed, timeSpentMinutes })
}

export const deleteEntry = async (id: string)
: Promise<void> => {
  const entry = await Entry.findByPk(id)
  if (!entry) throw new NotFoundError('Entry not found') 
  return entry.destroy()
}