import { parseDateOnly } from "./date"
import { diffInDays } from "./date"

import type { Entry } from "@shared"

export const getCurrentStreak = (entries: Entry[]): number => {
  if (!entries.length) return 0

  const sorted = [...entries].sort(
    (a, b) =>
      parseDateOnly(b.date).getTime() -
      parseDateOnly(a.date).getTime()
  )

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  let prevDate = today

  for (const entry of sorted) {
    const entryDate = parseDateOnly(entry.date)
    const diff = diffInDays(prevDate, entryDate)

    if (diff === 0 && streak === 0) {
      streak = 1
    } else if (diff === 1) {
      streak++
    } else {
      break
    }

    prevDate = entryDate
  }

  return streak
}

export const getLongestStreak = (entries: Entry[]): number => {
  if (!entries.length) return 0

  const sorted = [...entries].sort(
    (a, b) =>
      parseDateOnly(a.date).getTime() -
      parseDateOnly(b.date).getTime()
  )

  let longest = 1
  let current = 1

  for (let i = 1; i < sorted.length; i++) {
    const prev = parseDateOnly(sorted[i - 1].date)
    const curr = parseDateOnly(sorted[i].date)

    const diff = diffInDays(curr, prev)

    if (diff === 1) {
      current++
      longest = Math.max(longest, current)
    } else if (diff > 1) {
      current = 1
    }
  }

  return longest
}
