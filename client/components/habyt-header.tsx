import { StyleSheet } from "react-native"

import { HabytDropdownMenu } from "./habyt-dropdown-menu"
import { ThemedView } from "./themed-view"
import { ThemedText } from "./themed-text"

interface HabytHeaderProps {
  title: string
  editable?: boolean
  onDelete?: () => void
  onEdit?: () => void
}

export const HabytHeader = ({ title, onEdit, onDelete, editable = false }: HabytHeaderProps) => {
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
    <ThemedView style={styles.headerContainer}>
      <ThemedText type="subtitle" style={styles.title}>{title}</ThemedText>
      {editable && menuOptions.length > 0 && (
        <HabytDropdownMenu options={menuOptions} />
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
  },
})
