import Entry from "../models/entry.js"
import type { EntryCreateBody, EntryUpdateBody, EntryResult } from "../types/entry.types.js"

export const findAll = (habytId: string): Promise<Entry[]> => {
  return Entry.findAll({
    where: { habytId },
    order: [['date', 'DESC']] 
  })
}

export const createEntry = async (
  { date, completed = false, timeSpentMinutes = null, habytId }: EntryCreateBody)
  : Promise<EntryResult> => {
  try {
    const newEntry = await Entry.create({ date, completed, timeSpentMinutes, habytId })
    return newEntry
  } catch (error: unknown) {
      if ((error as { name: string }).name === "SequelizeUniqueConstraintError")
        return { error: "Entry for this date already exists" }
    throw error
  }
}

export const updateEntry = async (
  id: string, completed: boolean, timeSpentMinutes: number | null)
  : Promise<EntryResult> => {
  const entry = await Entry.findByPk(id)
  if (!entry) return { error: 'Entry not found' }

  const updates: EntryUpdateBody = { completed }
  if (timeSpentMinutes !== null && timeSpentMinutes !== undefined)
    updates.timeSpentMinutes = timeSpentMinutes
  
  return await entry.update(updates)
}

export const deleteEntry = async (id: string)
: Promise<{ success: true } | { error: string }> => {
  const entry = await Entry.findByPk(id)
  if (!entry) return { error: 'Entry not found' }
  await entry.destroy()
  return { success: true }
}