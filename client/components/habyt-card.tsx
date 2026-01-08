import { StyleSheet, TouchableOpacity } from "react-native"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "expo-router"
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
  const router = useRouter()
  const colorScheme = useColorScheme() ?? 'light'
  const iconColor = useThemeColor({}, 'icon')
  const [entries, setEntries] = useState<Entry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<{
    id: string
    completed: boolean
    timeSpentMinutes: number | null
  } | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

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

  const handleCreate = () => {
    router.push({
      pathname: '/(protected)/create-entry-modal',
      params: { habytId: id }
    })
  }

  const handleEditEntry = (date: Date) => {
    const dateString = date.toISOString().split('T')[0] // Convert to YYYY-MM-DD
    const entry = entries.find(e => e.date === dateString)

    if (entry) {
      setSelectedEntry({
        id: entry.id,
        completed: entry.completed,
        timeSpentMinutes: entry.timeSpentMinutes
      })
      setModalVisible(true)
    } else {
      ThemedAlert.alert('No entry', 'No entry exists for this date')
    }
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setSelectedEntry(null)
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
          cellSize={14}
          theme={{ ...heatmapTheme, scheme: colorScheme }}
          pressable
          onCellPress={({ date }) => handleEditEntry(date)}
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

      {selectedEntry &&
        <UpdateEntryModal
          visible={modalVisible}
          onClose={handleModalClose}
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
