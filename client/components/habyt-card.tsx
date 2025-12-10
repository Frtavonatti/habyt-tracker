import { StyleSheet } from "react-native"

import { ThemedView } from "./themed-view"
import { ThemedText } from "./themed-text"
import { HabytDropdownMenu } from "./habyt-dropdown-menu"

import type { Habyt } from '@shared/types/habyt.types'

interface HabytCardProps extends Habyt {
  onEdit?: () => void
  onDelete?: () => void
}

export function HabytCard ({ title, description, onEdit, onDelete }: HabytCardProps) {
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

  return (
    <ThemedView style={styles.habytContainer}>
      <ThemedView style={styles.contentContainer}>
        <ThemedText type="subtitle">{title}</ThemedText>
        <ThemedText>{description}</ThemedText>
      </ThemedView>
      {menuOptions.length > 0 && (
        <HabytDropdownMenu options={menuOptions} />
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  habytContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  contentContainer: {
    flex: 1,
    gap: 4,
  },
})
