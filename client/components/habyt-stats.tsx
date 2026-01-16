import { useMemo } from "react"

import { ThemedView } from "./themed-view"
import { StatsRow } from "./stats-row"
import { getCurrentStreak, getLongestStreak } from "@/utils/streak"

import type { Entry } from "@shared"

type HabytStatsProps = {
  entries: Entry[]
}

export const HabytStats = ({ entries }: HabytStatsProps) => {
  const { entriesNum, totalTime, averageTime, currentStreak, longestStreak } = useMemo(() => {
    const entriesNum = entries.length
    const totalTime = entries.reduce(
      (a: number, c: Entry | null) => a + (c?.timeSpentMinutes ?? 0), 0
    )
    const averageTime = entriesNum ? totalTime / entriesNum : 0

    return {
      entriesNum,
      totalTime,
      averageTime: Math.round(averageTime * 10) / 10,
      currentStreak: getCurrentStreak(entries),
      longestStreak: getLongestStreak(entries)
    }
  }, [entries])

  if (entries.length)
    return (
      <ThemedView>
        <StatsRow
          label={"Longest streak"}
          value={longestStreak}
        />
        <StatsRow
          label="Streak"
          value={currentStreak}
        />
        <StatsRow
          label="Number of Entries"
          value={entriesNum}
        />
        <StatsRow
          label="Average"
          value={averageTime}
        />
        <StatsRow
          label="Total"
          value={totalTime}
        />
      </ThemedView >
    )
}
