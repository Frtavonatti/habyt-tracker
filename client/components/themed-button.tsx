import { 
  StyleSheet, 
  TouchableOpacity, 
  type ViewStyle,
  type TouchableOpacityProps 
} from "react-native"
import { ThemedText } from "./themed-text"
import { useThemeColor } from "@/hooks/use-theme-color"

export type ThemedButtonProps = TouchableOpacityProps & {
  title: string
  lightColor?: string
  darkColor?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'small' | 'medium' | 'large'
  style?: ViewStyle
}

export const ThemedButton = ({ 
  style,
  title,
  lightColor,
  darkColor,
  variant = 'primary',
  size = 'medium',
  disabled,
  ...rest
}: ThemedButtonProps) => {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor }, 
    'tint'
  )
  const textColor = useThemeColor({}, 'background')

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
        size === 'small' && styles.small,
        size === 'medium' && styles.medium,
        size === 'large' && styles.large,
        variant === 'outline' && styles.outline,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
      activeOpacity={0.7}
      {...rest}
    >
      <ThemedText 
        style={[
          styles.text,
          variant === 'outline' && { color: backgroundColor },
          variant === 'secondary' && styles.secondaryText,
          variant === 'danger' && styles.dangerText,
        ]}
        lightColor={variant === 'outline' ? lightColor : textColor}
        darkColor={variant === 'outline' ? darkColor : textColor}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
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
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  secondary: {
    backgroundColor: '#687076',
  },
  danger: {
    backgroundColor: '#dc3545',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: '#fff',
  },
  dangerText: {
    color: '#fff',
  },
})