import { ActivityIndicator } from 'react-native'
import { Stack, Redirect } from 'expo-router'
import { useAuth } from '@/hooks/use-auth'

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading)
    return <ActivityIndicator />

  if (isAuthenticated)
    return <Redirect href="/(protected)/(tabs)" />

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  )
}