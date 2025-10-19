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

export type EntryResponse = EntryBase
