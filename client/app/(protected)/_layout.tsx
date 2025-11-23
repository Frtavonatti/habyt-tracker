import { ActivityIndicator } from 'react-native'
import { Stack, Redirect } from 'expo-router'
import { useAuth } from '@/hooks/use-auth'

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading)
    return <ActivityIndicator />

  if (!isAuthenticated)
    return <Redirect href="/(auth)/login" />

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}