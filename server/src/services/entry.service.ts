import Entry from "../models/entry.js"
import { NotFoundError, AppError } from "../utils/errors.js"
import type { EntryCreateData, EntryUpdateBody, Entry as EntryDTO } from "@shared/types/entry.types.js"

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
  const existingEntry = await Entry.findOne({ where: { habytId, date } })

  if (existingEntry)
    throw new AppError('Entry for this date already exists', 409)

  return await Entry.create({ date, completed, timeSpentMinutes, habytId })
}

export const updateEntry = async (
  id: string, updates: EntryUpdateBody
): Promise<EntryDTO> => {
  const entry = await Entry.findByPk(id)
  if (!entry) throw new NotFoundError('Entry not found')

  const updateData: Partial<{ completed: boolean; timeSpentMinutes: number | null }> = {}
  if (updates.completed !== undefined)
    updateData.completed = updates.completed
  if (updates.timeSpentMinutes !== undefined)
    updateData.timeSpentMinutes = updates.timeSpentMinutes

  return await entry.update(updateData)
}

export const deleteEntry = async (id: string)
  : Promise<void> => {
  const entry = await Entry.findByPk(id)
  if (!entry) throw new NotFoundError('Entry not found')
  return entry.destroy()
}
