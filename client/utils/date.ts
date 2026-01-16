export const parseDateOnly = (date: string): Date => {
  return new Date(`${date}T00:00:00`)
}

export const diffInDays = (a: Date, b: Date): number => {
  const MS_PER_DAY = 1000 * 60 * 60 * 24
  return Math.floor(
    (a.getTime() - b.getTime()) / MS_PER_DAY
  )
}
