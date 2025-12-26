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

export default function UpdateEntryModal() {
  const { token } = useRequireAuth()
  const router = useRouter()
  const params = useLocalSearchParams<{
    entryId: string
    completed: string
    timeSpentMinutes: string
  }>()

  const [completed, setCompleted] = useState(params.completed === 'true')
  const [timeSpentMinutes, setTimeSpentMinutes] = useState<number | null>(
    params.timeSpentMinutes ? parseInt(params.timeSpentMinutes, 10) : null
  )
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!params.entryId) {
      Alert.alert('Error', 'No entry ID provided')
      router.back()
      return
    }
  }, [])

  const handleUpdate = async () => {
    try {
      setIsLoading(true)
      await entryService.updateEntry({ 
        id: params.entryId, 
        token, 
        timeSpentMinutes, 
        completed 
      })
      router.back()
    } catch (error) {
      console.error('Failed to edit entry:', error)
      Alert.alert('Error', 'Failed to update entry')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const deleteEntry = async () => {
              try {
                setIsLoading(true)
                await entryService.deleteEntry({ id: params.entryId, token })
                router.back()
              } catch (error) {
                console.error('Failed to delete entry:', error)
                Alert.alert('Error', 'Failed to delete entry')
              } finally {
                setIsLoading(false)
              }
            }
            void deleteEntry()
          }
        }
      ]
    )
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
