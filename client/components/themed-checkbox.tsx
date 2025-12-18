import { StyleSheet, TouchableOpacity, View } from "react-native"
import { IconSymbol } from "./ui/icon-symbol"
import { ThemedText } from "./themed-text"
import { useThemeColor } from "@/hooks/use-theme-color"

export interface ThemedCheckboxProps {
  label?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function ThemedCheckbox({
  label,
  checked,
  onCheckedChange,
  disabled = false,
}: ThemedCheckboxProps) {
  const tintColor = useThemeColor({}, 'tint')
  const iconColor = useThemeColor({}, 'icon')

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => !disabled && onCheckedChange(!checked)}
        disabled={disabled}
        activeOpacity={0.7}
        style={[styles.iconWrapper, disabled && styles.disabled]}
      >
        <IconSymbol 
          name="checkmark.square" 
          size={28} 
          color={checked ? tintColor : iconColor}
          style={{ opacity: checked ? 1 : 0.3 }}
        />
      </TouchableOpacity>
      {label && (
        <ThemedText style={[styles.label, disabled && styles.disabledText]}>
          {label}
        </ThemedText>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
})
