import { StyleSheet } from "react-native"
import { useEffect, useState } from "react"

import { useRequireAuth } from "@/hooks/use-auth"
import { entryService } from "@/services/entryServices"
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
    console.log("Creating new entry")
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
