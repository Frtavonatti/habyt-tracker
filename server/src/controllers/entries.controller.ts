import type { Request, Response } from 'express'
import type { 
  EntryBase, 
  EntryCreateBody, 
  EntryResponse, 
  EntryUpdateBody 
} from '../../../shared/src/types/entry.types.js'

import * as entryService from '../services/entry.service.js'
import { findUserById } from '../services/user.service.js'
import { findHabytById } from '../services/habyt.service.js'

import { validateHabytId, validateEntryId, validateTimeSpent } from '../validators/entry.validator.js'
import { ForbiddenError } from '../utils/errors.js'
import { toDateOnlyUTC } from '../utils/toDateOnly.js'
import { toEntryBase } from '../../../shared/src/types/entry.types.js'

export const listEntries = async (
  req: Request<{habytId: string}, unknown, unknown>, 
  res: Response<EntryBase[] | { error: string }>
) => {
  const { habytId }: { habytId: string } = req.params
  validateHabytId(habytId)

  const habyt = await findHabytById(habytId)

  const user = await findUserById(req.decodedToken?.id as string | undefined)
    if (user.id !== habyt.userId) 
      throw new ForbiddenError('Forbidden: only the habyt owner can see the entries')

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

  const user = await findUserById(req.decodedToken?.id as string | undefined)
  if (user.id !== habyt.userId) 
    throw new ForbiddenError('Forbidden: only the habyt owner can add new entries')

  const date = toDateOnlyUTC(new Date())

  const newEntry = await entryService.createEntry({
    date,
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
  validateEntryId(id)

  let { completed, timeSpentMinutes } = req.body
  completed ??= false
  timeSpentMinutes ??= null
  validateTimeSpent(timeSpentMinutes)

  const entry = await entryService.findEntryById(id)
  const habyt = await findHabytById(entry.habytId)
  const user = await findUserById(req.decodedToken?.id as string | undefined)
  if (user.id !== habyt.userId)
    throw new ForbiddenError('Forbidden: only the habyt owner can update entries')
  
  const result = await entryService.updateEntry(id, completed, timeSpentMinutes)
  return res.json(toEntryBase(result))
}

export const deleteEntry = async (
  req: Request<{id: string}, unknown, unknown>, 
  res: Response<void | { error: string }>
) => {
  const { id }: { id: string } = req.params
  validateEntryId(id)
  await entryService.deleteEntry(id)
  return res.status(204).end()
}