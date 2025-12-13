import { ActivityIndicator } from 'react-native'
import { Stack, Redirect } from 'expo-router'
import { useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useTokenValidator } from '@/hooks/use-token-validator' 

export default function ProtectedLayout() {
  const { state, logout } = useAuth()

  // - [ ] TO-DO: study usecallback
  const handleTokenExpired = useCallback(() => {
    void logout()
  }, [logout])

  useTokenValidator(
    state.status === 'authenticated' ? state.token : null,
    handleTokenExpired
  )

  if (state.status === 'loading')
    return <ActivityIndicator />

  if (state.status === 'unauthenticated')
    return <Redirect href="/(auth)/login" />

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="create-habyt-modal"
        options={{
          presentation: 'modal',
          title: 'Create Habyt'
        }} 
      />
    </Stack>
  )
}