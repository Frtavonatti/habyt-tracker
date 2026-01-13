import { StyleSheet, TouchableOpacity } from "react-native"

import { useThemeColor } from "@/hooks/use-theme-color"
import { ThemedButton } from "./themed-button"
import { ThemedText } from "./themed-text"
import { ThemedView } from "./themed-view"
import { IconSymbol } from "./ui/icon-symbol"

interface HabytActionsProps {
  completed: boolean
  editable?: boolean
  onCreate?: () => void
  onEdit?: (date: Date) => void
}

export const HabytActions = ({ onCreate, onEdit, completed, editable = false }: HabytActionsProps) => {
  const iconColor = useThemeColor({}, "icon")

  return (
    <>
      {completed && editable &&
        < ThemedView style={[styles.completedContainer, { borderColor: iconColor }]}>
          <ThemedView style={styles.completedTextContainer}>
            <IconSymbol name="checkmark.square" size={24} color={iconColor} style={styles.completedText} />
            <ThemedText>Completed</ThemedText>
          </ThemedView>
          <TouchableOpacity onPress={() => onEdit?.(new Date())}>
            <IconSymbol name="pencil" size={24} color={iconColor} />
          </TouchableOpacity>
        </ThemedView >
      }

      {editable && !completed &&
        < ThemedButton
          title="Log Today"
          variant="secondary"
          onPress={() => onCreate?.()}
        />
      }
    </>
  )
}

const styles = StyleSheet.create({
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
