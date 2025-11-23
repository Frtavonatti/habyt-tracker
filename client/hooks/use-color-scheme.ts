import { useTheme } from '@/contexts/ThemeContext'
// export { useColorScheme } from 'react-native'

export function useColorScheme() {
  const { theme } = useTheme()
  return theme
}
