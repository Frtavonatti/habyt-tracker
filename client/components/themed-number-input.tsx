import { StyleSheet, TextInput, View, type TextInputProps } from "react-native"
import { ThemedText } from "./themed-text"
import { useThemeColor } from "@/hooks/use-theme-color"

export type ThemedNumberInputProps = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  lightColor?: string
  darkColor?: string
  label?: string
  size?: 'small' | 'medium' | 'large'
  value: number | null
  onChangeValue: (value: number | null) => void
  min?: number
  max?: number
}

export function ThemedNumberInput({
  lightColor,
  darkColor,
  style,
  label,
  size = 'medium',
  value,
  onChangeValue,
  min,
  max,
  ...otherProps
}: ThemedNumberInputProps) {
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text')
  const backgroundColor = useThemeColor({}, 'background')
  const borderColor = useThemeColor({}, 'icon')
  const placeholderTextColor = useThemeColor({}, 'icon')

  const handleChangeText = (text: string) => {
    if (text === '') {
      onChangeValue(null)
      return
    }

    // Remove any non-numeric characters except for leading minus
    const cleanedText = text.replace(/[^0-9-]/g, '')
    
    const numValue = parseInt(cleanedText, 10)

    if (isNaN(numValue)) {
      onChangeValue(null)
      return
    }

    let finalValue = numValue
    if (min !== undefined && numValue < min) {
      finalValue = min
    }
    if (max !== undefined && numValue > max) {
      finalValue = max
    }

    onChangeValue(finalValue)
  }

  const input = (
    <TextInput
      style={[
        styles.input,
        { color: textColor, backgroundColor, borderColor },
        size === 'small' && styles.small,
        size === 'medium' && styles.medium,
        size === 'large' && styles.large,
        style,
      ]}
      placeholderTextColor={placeholderTextColor}
      keyboardType="numeric"
      value={value !== null ? String(value) : ''}
      onChangeText={handleChangeText}
      {...otherProps}
    />
  )

  if (label) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        {input}
      </View>
    )
  }

  return input
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  small: {
    height: 32,
    paddingHorizontal: 12,
  },
  medium: {
    height: 48,
  },
  large: {
    height: 56,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
})
