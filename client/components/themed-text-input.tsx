import { StyleSheet, TextInput, View, type TextInputProps } from "react-native"
import { ThemedText } from "./themed-text"
import { useThemeColor } from "@/hooks/use-theme-color"

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string
  darkColor?: string
  label?: string
  size?: 'small' | 'medium' | 'large'
}

export function ThemedTextInput({
  lightColor,
  darkColor,
  style,
  label,
  size = 'medium',
  ...otherProps
}: ThemedTextInputProps) {
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text')
  const backgroundColor = useThemeColor({}, 'background')
  const borderColor = useThemeColor({}, 'icon')
  const placeholderTextColor = useThemeColor({}, 'icon')

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