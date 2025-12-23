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
    id: string
  }>()

  const [completed, setCompleted] = useState(false)
  const [timeSpentMinutes, setTimeSpentMinutes] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!params.id) {
      Alert.alert('Error', 'No id provided')
      router.back()
      return
    }
  }, [])

  const handleUpdate = async () => {
    try {
      setIsLoading(true)
      await entryService.updateEntry({ id: params.id, token, timeSpentMinutes, completed })
      router.back()
    } catch (error) {
      console.error('Failed to edit entry:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await entryService.deleteEntry({ id: params.id, token })
    } catch (error) {
      console.log(error)
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
        <ThemedText type="title">Edit entry</ThemedText>

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
            title="Delete"
            variant="danger"
            onPress={() => void handleDelete()}
            style={styles.button}
            disabled={isLoading}
          />
          <ThemedButton
            title="Submit"
            onPress={() => void handleUpdate()}
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
