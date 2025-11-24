import { StyleSheet, TextInput, type TextInputProps } from "react-native"

import { useThemeColor } from "@/hooks/use-theme-color"

export type ThemedTextProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
}

export function ThemedTextInput(props: ThemedTextProps) {
  const { lightColor, darkColor, style, ...otherProps } = props

  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text')
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background')
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'icon')
  const placeholderTextColor = useThemeColor({ light: lightColor, dark: darkColor }, 'icon')

  return (
    <TextInput
      style={[
        styles.input,
        { color: textColor, backgroundColor, borderColor },
        style,
      ]}
      placeholderTextColor={placeholderTextColor}
      {...otherProps}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
})