import { useState, useEffect } from 'react'
import { StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'

import { useRequireAuth } from '@/hooks/use-auth'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { ThemedCheckbox } from '@/components/themed-checkbox'
import { ThemedNumberInput } from '@/components/themed-number-input'
import { ThemedButton } from '@/components/themed-button'
import { entryService } from '@/services/entryServices'

export default function CreateEntryModal() {
  const { token } = useRequireAuth()
  const router = useRouter()
  const params = useLocalSearchParams<{
    habytId: string
  }>()

  const [completed, setCompleted] = useState(false)
  const [timeSpentMinutes, setTimeSpentMinutes] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!params.habytId) {
      Alert.alert('Error', 'No habyt ID provided')
      router.back()
      return
    }
  }, [])

  const handleCreate = async () => {
    try {
      setIsLoading(true)
      await entryService.createEntry({ id: params.habytId, token, timeSpentMinutes, completed })
      router.back()
    } catch (error) {
      console.error('Failed to input new entry:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ThemedText type="title">Input a new entry</ThemedText>

        <ThemedView style={styles.form}>
          <ThemedCheckbox
            label="Mark as completed"
            checked={completed}
            onCheckedChange={setCompleted}
          />

          <ThemedNumberInput
            label="Time spent (minutes)"
            value={timeSpentMinutes}
            onChangeValue={setTimeSpentMinutes}
            placeholder="Enter time in minutes (optional)"
            min={0}
          />
        </ThemedView>

        <ThemedView style={styles.buttons}>
          <ThemedButton
            title="Cancel"
            variant="secondary"
            onPress={() => router.back()}
            style={styles.button}
            disabled={isLoading}
          />
          <ThemedButton
            title="Create"
            onPress={() => void handleCreate()}
            style={styles.button}
            disabled={isLoading}
          />
        </ThemedView>
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  form: {
    gap: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
})
