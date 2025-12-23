import { StyleSheet } from "react-native"
import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import { WeeklyHeatMap } from "@symbiot.dev/react-native-heatmap"

import { entryService } from "@/services/entryServices"
import { useRequireAuth } from "@/hooks/use-auth"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { ThemedView } from "./themed-view"
import { ThemedText } from "./themed-text"
import { ThemedButton } from "./themed-button"
import { HabytDropdownMenu } from "./habyt-dropdown-menu"

import type { Habyt, Entry } from '@shared'

interface HabytCardProps extends Habyt {
  onEdit?: () => void
  onDelete?: () => void
}

export function HabytCard({ id, title, description, onEdit, onDelete }: HabytCardProps) {
  const { token } = useRequireAuth()
  const router = useRouter()
  const colorScheme = useColorScheme() ?? 'light'
  const [entries, setEntries] = useState<Entry[]>([])

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

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await entryService.fetchAll(id, token)
        setEntries(response)
      } catch (error) {
        console.log(error)
      }
    }
    void fetchEntries()
  }, [id])

  const handleCreate = () => {
    router.push({
      pathname: '/create-entry-modal',
      params: { habytId: id }
    })
  }

  const handleEdit = () => {
    router.push({
      pathname: '/update-entry.modal',
      params: { id } // This should connect to the entryId from the component
    })
  }

  // GitHub-style heatmap theme
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
    <ThemedView style={styles.habytContainer}>
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="subtitle" style={styles.title}>{title}</ThemedText>
        {menuOptions.length > 0 && (
          <HabytDropdownMenu options={menuOptions} />
        )}
      </ThemedView>
      <ThemedText>{description}</ThemedText>
      <WeeklyHeatMap
        data={entries.map(entry => (entry.date))}
        theme={heatmapTheme}
        pressable
        onCellPress={() => handleEdit()}
      />
      <ThemedButton
        title="Log Today"
        variant="secondary"
        onPress={() => handleCreate()}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  habytContainer: {
    flexDirection: 'column',
    gap: 12,
    borderWidth: 1,
    borderRadius: '5px',
    borderColor: 'white',
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
})
