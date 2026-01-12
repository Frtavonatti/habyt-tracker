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

interface CreateEntryModalProps {
  visible: boolean
  onClose: () => Promise<void>
  habytId: string
  token: string
  date: string | null
}

export function CreateEntryModal({
  visible,
  onClose,
  habytId,
  token,
  date
}: CreateEntryModalProps) {
  const [completed, setCompleted] = useState(false)
  const [timeSpentMinutes, setTimeSpentMinutes] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async () => {
    try {
      setIsLoading(true)
      await entryService.createEntry({
        habytId,
        token,
        date,
        timeSpentMinutes,
        completed
      })
      onClose()
    } catch (error) {
      console.error('Failed to create entry:', error)
      ThemedAlert.alert('Error', 'Failed to create entry')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ThemedModal visible={visible} onClose={onClose}>
      <ThemedView style={styles.title}>
        <ThemedText type="subtitle">Log new entry</ThemedText>
        <ThemedText>{date}</ThemedText>
      </ThemedView>

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
          title="Submit"
          onPress={handleCreate}
          style={styles.button}
          disabled={isLoading}
        />
      </ThemedView>
    </ThemedModal >
  )
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
