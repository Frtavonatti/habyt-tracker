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
import { findHabytById as assertHabytOwnership } from '@/services/habyt.service.js'
import { BadRequestError } from '../utils/errors.js'
import { toDateOnlyUTC } from '../utils/toDateOnly.js'

export const listEntries = async (
  req: Request<HabytIdParam, unknown, unknown>,
  res: Response
) => {
  const { habytId } = habytIdParamSchema.parse(req.params)
  const userId = req.decodedToken!.id as string

  await assertHabytOwnership(habytId, userId)
  const entries = await entryService.findAll(habytId)
  return res.json(entries)
}

export const createEntry = async (
  req: Request<HabytIdParam, unknown, EntryCreateBody>,
  res: Response
) => {
  const { habytId } = habytIdParamSchema.parse(req.params)
  const { date: parsedDate, completed, timeSpentMinutes } = entryCreateSchema.parse(req.body)
  const userId = req.decodedToken!.id as string

  await assertHabytOwnership(habytId, userId)

  const date = parsedDate ?? toDateOnlyUTC(new Date())

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
  const userId = req.decodedToken!.id as string

  const entry = await entryService.findEntryById(id)
  await assertHabytOwnership(entry.habytId, userId)

  const result = await entryService.updateEntry(id, updateData)
  return res.json(result)
}

export const deleteEntry = async (
  req: Request<EntryIdParam>,
  res: Response
) => {
  const { id } = entryIdParamSchema.parse(req.params)
  const userId = req.decodedToken!.id as string

  const entry = await entryService.findEntryById(id)
  await assertHabytOwnership(entry.habytId, userId)

  await entryService.deleteEntry(id)
  return res.status(204).end()
}
