import type { Request, Response } from 'express'
import type { 
  EntryBase, 
  EntryCreateBody, 
  EntryResponse, 
  EntryUpdateBody 
} from '../types/entry.types.js'

import * as entryService from '../services/entry.service.js'
import { findUserById } from '../services/user.service.js'
import { findHabytById } from '../services/habyt.service.js'

import { toDateOnlyUTC } from '../utils/toDateOnly.js'
import { toEntryBase } from '../types/entry.types.js'

export const listEntries = async (
  req: Request<{habytId: string}, unknown, unknown>, 
  res: Response<EntryBase[] | { error: string }>
) => {
  const { habytId }: { habytId: string } = req.params
  if (!habytId || typeof habytId != 'string' || habytId.trim() === '' )
    return res.status(400).json({ error: 'habytId param is required' })

  const user = await findUserById(req.decodedToken?.id as string | undefined)
  if ('error' in user) 
    return res.status(user.error === 'Missing id' ? 400 : 404).json({ error: user.error })

  const habyt = await findHabytById(habytId)
  if ('error' in habyt) return res.status(404).json({ error: habyt.error })

  const entries = await entryService.findAll(habytId)
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

  const habyt = await findHabytById(habytId)
  if ('error' in habyt) return res.status(404).json({ error: habyt.error })

  const user = await findUserById(req.decodedToken?.id as string | undefined)
  if ('error' in user) 
    return res.status(user.error === 'Missing id' ? 400 : 404).json({ error: user.error })
  if (user.id !== habyt.userId) 
    return res.status(403).json({ error: 'Forbidden: only the habyt owner can add new entries' })

  const date = toDateOnlyUTC(new Date())

  const newEntry = await entryService.createEntry({
    date,
    completed,
    timeSpentMinutes,
    habytId
  })
  
  if ('error' in newEntry) return res.status(409).json({ error: newEntry.error })
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

  const user = await findUserById(req.decodedToken?.id as string | undefined)
  if ('error' in user) 
    return res.status(user.error === 'Missing id' ? 400 : 404).json({ error: user.error })

  const result = await entryService.updateEntry(id, completed, timeSpentMinutes)
  if ('error' in result)
    return res.status(404).json({ error: result.error })

  return res.json(toEntryBase(result))
}

export const deleteEntry = async (
  req: Request<{id: string}, unknown, unknown>, 
  res: Response<void | { error: string }>
) => {
  const { id }: { id: string } = req.params
  if (!id || typeof id !== 'string' || id.trim() === '') 
    return res.status(400).json({ error: 'Entry id param must be defined' })
  
  const result = await entryService.deleteEntry(id)
  if ('error' in result) 
    return res.status(404).json({ error: result.error })
  return res.status(204).end()
}