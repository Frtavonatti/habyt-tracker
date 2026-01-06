import type { z } from 'zod'
import type {
  entryCreateSchema,
  entryUpdateSchema,
  entrySchema,
  habytIdParamSchema,
  entryIdParamSchema
} from '../schemas/entry.schema.js'

export type EntryCreateBody = z.infer<typeof entryCreateSchema>
export type EntryUpdateBody = z.infer<typeof entryUpdateSchema>
export type Entry = z.infer<typeof entrySchema>
export type HabytIdParam = z.infer<typeof habytIdParamSchema>
export type EntryIdParam = z.infer<typeof entryIdParamSchema>

export interface EntryCreateData {
  date: string // YYYY-MM-DD
  completed: boolean
  timeSpentMinutes: number | null
  habytId: string
}

export interface EntryCreateRequest {
  habytId: string
  token: string
  completed: boolean
  timeSpentMinutes: number | null
}

export interface EntryUpdateRequest {
  id: string
  token: string
  completed?: boolean
  timeSpentMinutes?: number | null
}

/* Legacy 
type WithDates<T> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt: Date | string
  updatedAt: Date | string
}

export function toEntryBase(entry: WithDates<Entry>): Entry {
  return {
    id: entry.id,
    date: entry.date,
    completed: entry.completed,
    timeSpentMinutes: entry.timeSpentMinutes,
    habytId: entry.habytId,
    createdAt: typeof entry.createdAt === 'string' ? entry.createdAt : entry.createdAt.toISOString(),
    updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : entry.updatedAt.toISOString()
  }
} */