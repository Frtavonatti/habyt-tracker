import { StyleSheet, TouchableOpacity } from "react-native"
import { useEffect, useState, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { WeeklyHeatMap } from "@symbiot.dev/react-native-heatmap"

import { entryService } from "@/services/entryServices"
import { useRequireAuth } from "@/hooks/use-auth"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { useThemeColor } from "@/hooks/use-theme-color"
import { HabytStats } from "./habyt-stats"
import { ThemedView } from "./themed-view"
import { ThemedText } from "./themed-text"
import { ThemedButton } from "./themed-button"
import { ThemedAlert } from "./themed-alert"
import { CreateEntryModal } from "./modals/create-entry"
import { UpdateEntryModal } from '@/components/modals/update-entry'
import { HabytDropdownMenu } from "./habyt-dropdown-menu"
import { heatmapTheme } from "@/constants/theme"
import { IconSymbol } from "./ui/icon-symbol"

import type { Habyt, Entry } from '@shared'

interface HabytCardProps extends Habyt {
  onEdit?: () => void
  onDelete?: () => void
}

export function HabytCard({ id, title, description, onEdit, onDelete }: HabytCardProps) {
  const { token } = useRequireAuth()
  const colorScheme = useColorScheme() ?? 'light'
  const iconColor = useThemeColor({}, 'icon')
  const [entries, setEntries] = useState<Entry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<{
    id: string
    completed: boolean
    timeSpentMinutes: number | null
  } | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [updateVisible, setUpdateVisible] = useState(false)
  const [createVisible, setCreateVisible] = useState(false)

  const fetchEntries = useCallback(async () => {
    try {
      const response = await entryService.fetchAll(id, token)
      setEntries(response)
    } catch (error) {
      console.log(error)
    }
  }, [id, token])

  // Fetch entries when component mounts
  useEffect(() => {
    void fetchEntries()
  }, [fetchEntries])

  // Refetch entries when screen comes back into focus (after editing)
  useFocusEffect(
    useCallback(() => {
      void fetchEntries()
    }, [fetchEntries])
  )

  const getTodayEntry = (): boolean => { // y-m-d format
    const today = new Date().toISOString().slice(0, 10)
    const entry = entries.find((e) => e.date == today)
    return Boolean(entry)
  }

  const menuOptions = [
    ...(onEdit ? [{
      label: 'Edit',
      icon: 'pencil' as const,
      onPress: onEdit,
      variant: 'default' as const,
    }] : []),
    ...(onDelete ? [{
      label: 'Delete',
      icon: 'trash' as const,
      onPress: onDelete,
      variant: 'danger' as const,
    }] : []),
  ]

  const findEntry = (date = new Date()) => {
    const dateString = date.toISOString().split('T')[0] // Convert to YYYY-MM-DD
    const entry = entries.find(e => e.date === dateString)
    if (!entry) return null
    return entry
  }

  const handleCreate = (date?: Date) => {
    const targetDate = date ?? new Date()
    const dateString = targetDate.toISOString().split('T')[0] // Convert to YYYY-MM-DD

    const existingEntry = findEntry(targetDate)
    if (existingEntry) {
      ThemedAlert.alert('Entry exists', 'An entry already exists for this date. You can edit it instead')
      return
    }

    setSelectedDate(dateString)
    setCreateVisible(true)
  }

  const handleEditEntry = (date: Date) => {
    const entry = findEntry(date)

    if (entry) {
      setSelectedEntry({
        id: entry.id,
        completed: entry.completed,
        timeSpentMinutes: entry.timeSpentMinutes
      })
      setUpdateVisible(true)
    } else {
      ThemedAlert.alert('No entry', 'No entry exists for this date')
    }
  }

  const handleModalClose = async (type: "create" | "update") => {
    if (type == "create") {
      setCreateVisible(false)
      setSelectedDate(null)
    } else if (type == "update") {
      setUpdateVisible(false)
      setSelectedEntry(null)
    }

    await fetchEntries()
  }

  // Evaluate another way of assigning heat values
  const heatmapData = entries.reduce((acc, entry) => {
    let level = 0
    if (entry.completed) {
      if (entry.timeSpentMinutes === null || entry.timeSpentMinutes === 0) {
        level = 1
      } else if (entry.timeSpentMinutes < 15) {
        level = 2
      } else if (entry.timeSpentMinutes < 30) {
        level = 3
      } else if (entry.timeSpentMinutes < 60) {
        level = 4
      } else {
        level = 5
      }
    }

    if (level > 0) {
      acc[entry.date] = level
    }

    return acc
  }, {} as Record<string, number>)

  const today = new Date()
  const yearInMilisecs = 365 * 24 * 60 * 60 * 1000
  const timeStamp = today.getTime() - yearInMilisecs
  const prevYear = new Date(timeStamp)

  return (
    <>
      <ThemedView style={[styles.habytContainer, { borderColor: iconColor }]}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="subtitle" style={styles.title}>{title}</ThemedText>
          {menuOptions.length > 0 && (
            <HabytDropdownMenu options={menuOptions} />
          )}
        </ThemedView>
        <ThemedText>{description}</ThemedText>
        <WeeklyHeatMap
          data={heatmapData}
          endDate={today}
          startDate={prevYear}
          cellSize={14}
          theme={{ ...heatmapTheme, scheme: colorScheme }}
          pressable
          onCellPress={({ date }) => findEntry(date)
            ? handleEditEntry(date)
            : handleCreate(date)
          }
        />
        {getTodayEntry()
          ? <ThemedView style={[styles.completedContainer, { borderColor: iconColor }]}>
            <ThemedView style={styles.completedTextContainer}>
              <IconSymbol name="checkmark.square" size={24} color={iconColor} style={styles.completedText} />
              <ThemedText>Completed</ThemedText>
            </ThemedView>
            <TouchableOpacity onPress={() => handleEditEntry(new Date())}>
              <IconSymbol name="pencil" size={24} color={iconColor} />
            </TouchableOpacity>
          </ThemedView>
          : <ThemedButton
            title="Log Today"
            variant="secondary"
            onPress={() => handleCreate()}
          />
        }
        <HabytStats entries={entries} />
      </ThemedView >

      <CreateEntryModal
        visible={createVisible}
        onClose={() => handleModalClose("create")}
        habytId={id}
        date={selectedDate}
        token={token}
      />

      {selectedEntry &&
        <UpdateEntryModal
          visible={updateVisible}
          onClose={() => handleModalClose("update")}
          entryId={selectedEntry.id}
          initialCompleted={selectedEntry.completed}
          initialTimeSpentMinutes={selectedEntry.timeSpentMinutes}
          token={token}
        />
      }
    </>
  )
}

const styles = StyleSheet.create({
  habytContainer: {
    flexDirection: 'column',
    gap: 12,
    borderWidth: 1,
    borderRadius: '5px',
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
  },
  contentContainer: {
    gap: 4,
  },
  completedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
  completedTextContainer: {
    flexDirection: 'row',
  },
  completedText: {
    paddingRight: 4,
  }
})
