import type { Request, Response } from 'express'
import type {
  EntryCreateBody,
  EntryUpdateBody,
  HabytIdParam,
  EntryIdParam
} from '@shared/types/entry.types.js'

import {
  entryCreateSchema,
  entryUpdateSchema,
  habytIdParamSchema,
  entryIdParamSchema,
} from '@shared/schemas/entry.schema.js'
import * as entryService from '../services/entry.service.js'
import { findUserById } from '../services/user.service.js'
import { findHabytById as assertHabytOwnership} from '@/services/habyt.service.js'
import { BadRequestError } from '../utils/errors.js'
import { toDateOnlyUTC } from '../utils/toDateOnly.js'

export const listEntries = async (
  req: Request<HabytIdParam, unknown, unknown>,
  res: Response
) => {
  const { habytId } = habytIdParamSchema.parse(req.params)

  const user = await findUserById(req.decodedToken?.id as string)
  await assertHabytOwnership(habytId, user.id)

  const entries = await entryService.findAll(habytId)
  return res.json(entries)
}

export const createEntry = async (
  req: Request<HabytIdParam, unknown, EntryCreateBody>,
  res: Response
) => {
  const { habytId } = habytIdParamSchema.parse(req.params)
  const { date: parsedDate, completed, timeSpentMinutes } = entryCreateSchema.parse(req.body)
  let date = parsedDate

  const user = await findUserById(req.decodedToken?.id as string)
  await assertHabytOwnership(habytId, user.id)
  
  date ??= toDateOnlyUTC(new Date())
  if (typeof date !== 'string')
    throw new BadRequestError('Invalid date format')

  const newEntry = await entryService.createEntry({
    date,
    completed,
    timeSpentMinutes,
    habytId
  })

  return res.status(201).json(newEntry)
}

export const updateEntry = async (
  req: Request<EntryIdParam, unknown, EntryUpdateBody>,
  res: Response
) => {
  const { id } = entryIdParamSchema.parse(req.params)
  const updateData = entryUpdateSchema.parse(req.body)

  const entry = await entryService.findEntryById(id)
  const user = await findUserById(req.decodedToken?.id as string)
  await assertHabytOwnership(entry.habytId, user.id)

  const result = await entryService.updateEntry(id, updateData)
  return res.json(result)
}

export const deleteEntry = async (
  req: Request<EntryIdParam>,
  res: Response
) => {
  const { id } = entryIdParamSchema.parse(req.params)  
  
  const entry = await entryService.findEntryById(id)
  const user = await findUserById(req.decodedToken?.id as string)
  await assertHabytOwnership(entry.habytId, user.id)
  
  await entryService.deleteEntry(id)
  return res.status(204).end()
}
