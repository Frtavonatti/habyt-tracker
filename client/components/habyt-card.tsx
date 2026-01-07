import { StyleSheet, TouchableOpacity } from "react-native"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "expo-router"
import { useFocusEffect } from "@react-navigation/native"
import { WeeklyHeatMap } from "@symbiot.dev/react-native-heatmap"

import { entryService } from "@/services/entryServices"
import { useRequireAuth } from "@/hooks/use-auth"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { useThemeColor } from "@/hooks/use-theme-color"
import { ThemedView } from "./themed-view"
import { ThemedText } from "./themed-text"
import { ThemedButton } from "./themed-button"
import { ThemedAlert } from "./themed-alert"
import { HabytDropdownMenu } from "./habyt-dropdown-menu"
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

  const handleEdit = (date: Date) => {
    const dateString = date.toISOString().split('T')[0] // Convert to YYYY-MM-DD
    const entry = entries.find(e => e.date === dateString)

    if (entry) {
      router.push({
        pathname: '/(protected)/update-entry.modal',
        params: {
          entryId: entry.id.toString(),
          completed: entry.completed.toString(),
          timeSpentMinutes: entry.timeSpentMinutes?.toString() ?? '',
        }
      })
    } else {
      ThemedAlert.alert('No entry', 'No entry exists for this date')
    }
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

  const heatmapTheme = {
    scheme: colorScheme,
    light: {
      headerTextColor: '#11181C',
      cellDefaultColor: '#ebedf0',
      cellTextColor: '#11181C',
      cellColor: {
        1: '#9be9a8',
        2: '#40c463',
        3: '#30a14e',
        4: '#216e39',
        5: '#216e39',
      },
      sidebarTextColor: '#11181C',
    },
    dark: {
      headerTextColor: '#ECEDEE',
      cellDefaultColor: '#161b22',
      cellTextColor: '#ECEDEE',
      cellColor: {
        1: '#0e4429',
        2: '#006d32',
        3: '#26a641',
        4: '#39d353',
        5: '#39d353',
      },
      sidebarTextColor: '#ECEDEE',
    },
  }

  return (
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
        theme={heatmapTheme}
        pressable
        onCellPress={({ date }) => handleEdit(date)}
      />
      {getTodayEntry()
        ? <ThemedView style={[styles.completedContainer, { borderColor: iconColor }]}>
          <ThemedView style={styles.completedTextContainer}>
            <IconSymbol name="checkmark.square" size={24} color={iconColor} style={styles.completedText} />
            <ThemedText>Completed</ThemedText>
          </ThemedView>
          <TouchableOpacity onPress={() => handleEdit(new Date())}>
            <IconSymbol name="pencil" size={24} color={iconColor} />
          </TouchableOpacity>
        </ThemedView>
        : <ThemedButton
          title="Log Today"
          variant="secondary"
          onPress={() => handleCreate()}
        />
      }
    </ThemedView >
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
