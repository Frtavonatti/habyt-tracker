import { ActivityIndicator } from 'react-native'
import { Stack, Redirect } from 'expo-router'
import { useAuth } from '@/hooks/use-auth'

export default function ProtectedLayout() {
  const { state } = useAuth()

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