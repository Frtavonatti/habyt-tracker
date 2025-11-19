export interface EntryBase {
  id: string
  date: string // YYYY-MM-DD (DateOnly)
  completed: boolean
  timeSpentMinutes: number | null
  habytId: string
  createdAt: string
  updatedAt: string
}

export interface EntryCreateBody {
  date: string
  completed?: boolean
  timeSpentMinutes?: number | null
  habytId: string
}

export interface EntryUpdateBody {
  completed?: boolean
  timeSpentMinutes?: number | null
}

export type EntryResponse = EntryBase | { error: string }

type WithDates<T> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt: Date | string
  updatedAt: Date | string
}

export function toEntryBase(entry: WithDates<EntryBase>): EntryBase {
  return {
    id: entry.id,
    date: entry.date,
    completed: entry.completed,
    timeSpentMinutes: entry.timeSpentMinutes,
    habytId: entry.habytId,
    createdAt: typeof entry.createdAt === 'string' ? entry.createdAt : entry.createdAt.toISOString(),
    updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : entry.updatedAt.toISOString()
  }
}