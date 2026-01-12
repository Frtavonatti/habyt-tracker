import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { ThemedCheckbox } from '@/components/themed-checkbox'
import { ThemedNumberInput } from '@/components/themed-number-input'
import { ThemedButton } from '@/components/themed-button'
import { ThemedAlert } from '@/components/themed-alert'
import { ThemedModal } from '@/components/themed-modal'
import { entryService } from '@/services/entryServices'

interface UpdateEntryModalProps {
  visible: boolean
  onClose: () => Promise<void>
  entryId: string
  initialCompleted: boolean
  initialTimeSpentMinutes: number | null
  token: string
}

export function UpdateEntryModal({
  visible,
  onClose,
  entryId,
  initialCompleted,
  initialTimeSpentMinutes,
  token
}: UpdateEntryModalProps) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [timeSpentMinutes, setTimeSpentMinutes] = useState<number | null>(initialTimeSpentMinutes)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async () => {
    try {
      setIsLoading(true)
      await entryService.updateEntry({
        id: entryId,
        token,
        timeSpentMinutes,
        completed
      })
      onClose()
    } catch (error) {
      console.error('Failed to edit entry:', error)
      ThemedAlert.alert('Error', 'Failed to update entry')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = () => {
    ThemedAlert.alert(
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
          onPress: async () => {
            try {
              setIsLoading(true)
              await entryService.deleteEntry({ id: entryId, token })
              onClose()
            } catch (error) {
              console.error('Failed to delete entry:', error)
              ThemedAlert.alert('Error', 'Failed to delete entry')
            } finally {
              setIsLoading(false)
            }
          }
        }
      ]
    )
  }

  return (
    <ThemedModal visible={visible} onClose={onClose}>
      <ThemedText type="subtitle" style={styles.title}>Edit entry</ThemedText>

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
          placeholder="Enter time (optional)"
          min={0}
        />
      </ThemedView>

      <ThemedView style={styles.buttons}>
        <ThemedButton
          title="Cancel"
          variant="secondary"
          onPress={onClose}
          style={styles.button}
          disabled={isLoading}
        />
        <ThemedButton
          title="Delete"
          variant="danger"
          onPress={handleDelete}
          style={styles.button}
          disabled={isLoading}
        />
        <ThemedButton
          title="Submit"
          onPress={handleUpdate}
          style={styles.button}
          disabled={isLoading}
        />
      </ThemedView>
    </ThemedModal>
  )
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
  },
  form: {
    gap: 16,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
  },
})
