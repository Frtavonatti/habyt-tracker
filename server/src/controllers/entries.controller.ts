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

import { validateHabytId, validateEntryId, validateTimeSpent } from '../validators/entry.validator.js'
import { AppError, ForbiddenError, NotFoundError } from '../utils/errors.js'
import { toDateOnlyUTC } from '../utils/toDateOnly.js'
import { toEntryBase } from '../types/entry.types.js'

export const listEntries = async (
  req: Request<{habytId: string}, unknown, unknown>, 
  res: Response<EntryBase[] | { error: string }>
) => {
  const { habytId }: { habytId: string } = req.params
  validateHabytId(habytId)

  const user = await findUserById(req.decodedToken?.id as string | undefined)
  if ('error' in user) throw new AppError(user.error, user.error === 'Missing id' ? 400 : 404)

  const habyt = await findHabytById(habytId)
  if ('error' in habyt) throw new NotFoundError(habyt.error)

  const entries = await entryService.findAll(habytId)
  return res.json(entries.map(toEntryBase))
}

export const createEntry = async (
  req: Request<{habytId: string}, unknown, EntryCreateBody>,
  res: Response<EntryResponse>
) => {
  const { habytId }: { habytId: string } = req.params
  validateHabytId(habytId)

  let { completed, timeSpentMinutes } = req.body
  completed ??= false
  timeSpentMinutes ??= null
  validateTimeSpent(timeSpentMinutes)

  const habyt = await findHabytById(habytId)
  if ('error' in habyt) throw new NotFoundError(habyt.error)

  const user = await findUserById(req.decodedToken?.id as string | undefined)
  if ('error' in user) 
    throw new AppError(user.error, user.error === 'Missing id' ? 400 : 404)
  if (user.id !== habyt.userId) 
    throw new ForbiddenError('Forbidden: only the habyt owner can add new entries')

  const date = toDateOnlyUTC(new Date())

  const newEntry = await entryService.createEntry({
    date,
    completed,
    timeSpentMinutes,
    habytId
  })
  
  if ('error' in newEntry) throw new AppError(newEntry.error, 409)
  return res.status(201).json(toEntryBase(newEntry))
}

export const updateEntry = async (
  req: Request<{id: string}, unknown, EntryUpdateBody>,
  res: Response<EntryResponse>
) => {
  const { id }: { id: string } = req.params
  validateEntryId(id)

  let { completed, timeSpentMinutes } = req.body
  completed ??= false
  timeSpentMinutes ??= null
  validateTimeSpent(timeSpentMinutes)

  const user = await findUserById(req.decodedToken?.id as string | undefined)
  if ('error' in user) throw new AppError(user.error, user.error === 'Missing id' ? 400 : 404)

  const result = await entryService.updateEntry(id, completed, timeSpentMinutes)
  if ('error' in result) throw new NotFoundError(result.error)

  return res.json(toEntryBase(result))
}

export const deleteEntry = async (
  req: Request<{id: string}, unknown, unknown>, 
  res: Response<void | { error: string }>
) => {
  const { id }: { id: string } = req.params
  validateEntryId(id)
  const result = await entryService.deleteEntry(id)
  if ('error' in result) throw new NotFoundError(result.error)
  return res.status(204).end()
}