import type { Request, Response } from 'express'
import type { 
  EntryBase, 
  EntryCreateBody, 
  EntryResponse, 
  EntryUpdateBody 
} from '../types/entry.types.js'

import { Entry, Habyt, User } from '../models/index.js'
import { toDateOnlyUTC } from '../utils/toDateOnly.js'
import { toEntryBase } from '../types/entry.types.js'

export const listEntries = async (
  req: Request<{habytId: string}, unknown, unknown>, 
  res: Response<EntryBase[] | { error: string }>
) => {
  const { habytId }: { habytId: string } = req.params
  if (!habytId || typeof habytId != 'string' || habytId.trim() === '' )
    return res.status(400).json({ error: 'habytId param is required' })

  const user = await User.findByPk(req.decodedToken?.id as string | undefined)
  if (!user) return res.status(404).json({ error: 'User not found' })

  const habyt = await Habyt.findByPk(habytId)
  if (!habyt) return res.status(404).json({ error: 'Habyt not found' })

  const entries = await Entry.findAll({ 
    where: { habytId },
    order: [['date', 'DESC']] 
  })
  
  return res.json(entries.map(toEntryBase))
}

export const createEntry = async (
  req: Request<{habytId: string}, unknown, EntryCreateBody>,
  res: Response<EntryResponse>
) => {
  const { habytId }: { habytId: string } = req.params
  if (!habytId || typeof habytId != 'string' || habytId.trim() === '' )
    return res.status(400).json({ error: 'habytId param is required' })

  let { completed, timeSpentMinutes } = req.body
  completed ??= false
  timeSpentMinutes ??= null
  if (timeSpentMinutes !== null && (typeof timeSpentMinutes !== 'number' || timeSpentMinutes < 0))
    return res.status(400).json({ error: 'timeSpentMinutes must be a non negative number or null' })

  const user = await User.findByPk(req.decodedToken?.id as string | undefined)
  if (!user) return res.status(404).json({ error: 'User not found' })

  const habyt = await Habyt.findByPk(habytId)
  if (!habyt) return res.status(404).json({ error: 'Habyt not found' })

  const newEntry = await Entry.create({
    date: toDateOnlyUTC(new Date()),
    completed,
    timeSpentMinutes,
    habytId
  })

  return res.status(201).json(toEntryBase(newEntry))
}

export const updateEntry = async (
  req: Request<{id: string}, unknown, EntryUpdateBody>,
  res: Response<EntryResponse>
) => {
  const { id }: { id: string } = req.params
  if (!id || typeof id !== 'string' || id.trim() === '')
    return res.status(400).json({ error: 'Entry id param must be defined' })

  let { completed, timeSpentMinutes } = req.body
  completed ??= false
  timeSpentMinutes ??= null
  if (timeSpentMinutes !== null && (typeof timeSpentMinutes !== 'number' || timeSpentMinutes < 0))
    return res.status(400).json({ error: 'timeSpentMinutes must be a non negative number or null' })

  const user = await User.findByPk(req.decodedToken?.id as string | undefined)
  if (!user) return res.status(404).json({ error: 'User not found' })

  const entry = await Entry.findByPk(id)
    if (!entry) return res.status(404).json({ error: 'Entry not found' })

  const updatedEntry = await entry.update({ completed, timeSpentMinutes })

  return res.json(toEntryBase(updatedEntry))
}

export const deleteEntry = async (
  req: Request<{id: string}, unknown, unknown>, 
  res: Response<void | { error: string }>
) => {
  const { id }: { id: string } = req.params
  if (!id || typeof id !== 'string' || id.trim() === '') 
    return res.status(400).json({ error: 'Entry id param must be defined' })
  
  const entry = await Entry.findByPk(id)
  if (!entry) return res.status(404).json({ error: 'Entry not found' })

  await entry.destroy()
  return res.status(204).end()
}