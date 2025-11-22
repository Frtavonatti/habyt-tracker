import Entry from "../models/entry.js"
import { NotFoundError, AppError } from "../utils/errors.js"
import type { EntryCreateBody, EntryUpdateBody } from "../../../shared/src/entry.types.js"

export const findAll = (habytId: string): Promise<Entry[]> => {
  return Entry.findAll({
    where: { habytId },
    order: [['date', 'DESC']] 
  })
}

export const findEntryById = async (id: string): Promise<Entry> => {
  const entry = await Entry.findByPk(id)
  if (!entry) throw new NotFoundError('Entry not found')
  return entry
}

export const createEntry = async (
  { date, completed = false, timeSpentMinutes = null, habytId }: EntryCreateBody)
  : Promise<Entry> => {
  try {
    const newEntry = await Entry.create({ date, completed, timeSpentMinutes, habytId })
    return newEntry
  } catch (error: unknown) {
      if ((error as { name: string }).name === "SequelizeUniqueConstraintError")
        throw new AppError('Entry for this date already exists', 409)
    throw error
  }
}

export const updateEntry = async (
  id: string, completed: boolean, timeSpentMinutes: number | null)
  : Promise<Entry> => {
  const entry = await Entry.findByPk(id)
  if (!entry) throw new NotFoundError('Entry not found') 

  const updates: EntryUpdateBody = { completed }
  if (timeSpentMinutes !== null && timeSpentMinutes !== undefined)
    updates.timeSpentMinutes = timeSpentMinutes
  
  return await entry.update(updates)
}

export const deleteEntry = async (id: string)
: Promise<{ success: true }> => {
  const entry = await Entry.findByPk(id)
  if (!entry) throw new NotFoundError('Entry not found') 
  await entry.destroy()
  return { success: true }
}