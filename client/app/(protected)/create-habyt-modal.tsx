import { useState } from 'react'
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'

import { useRequireAuth } from '@/hooks/use-auth'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { ThemedTextInput } from '@/components/themed-text-input'
import { ThemedButton } from '@/components/themed-button'
import { habytService } from '@/services/habytServices'

export default function CreateHabytModal() {
  const { token } = useRequireAuth()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async () => {
    try {
      setIsLoading(true)
      await habytService.createHabyt({ title, description, token })
      router.back()
      // TODO: Refresh habyts list
    } catch (error) {
      console.error('Failed to create habyt:', error)
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
        <ThemedText type="title">Create New Habyt</ThemedText>
        
        <ThemedView style={styles.form}>
          <ThemedTextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter habyt title"
            autoFocus
          />
          
          <ThemedTextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description (optional)"
            multiline
            numberOfLines={4}
            style={styles.textArea}
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
            disabled={!title.trim() || isLoading}
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
    gap: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
})