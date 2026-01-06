import { useState, useEffect } from 'react'
import { StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'

import { useRequireAuth } from '@/hooks/use-auth'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { ThemedTextInput } from '@/components/themed-text-input'
import { ThemedButton } from '@/components/themed-button'
import { habytService } from '@/services/habytServices'

export default function CreateHabytModal() {
  const { token } = useRequireAuth()
  const router = useRouter()
  const params = useLocalSearchParams<{
    id: string
    title: string
    description: string
  }>()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!params.id) {
      Alert.alert('Error', 'No habyt ID provided')
      router.back()
      return
    }

    setTitle(params.title || '')
    setDescription(params.description || '')
  }, [])

  const handleUpdate = async () => {
    try {
      setIsLoading(true)
      await habytService.updateHabyt({ 
        id: params.id, 
        title,
        description: description || null,
        token 
      })
      router.back()
    } catch (error) {
      console.error('Failed to update habyt:', error)
      Alert.alert('Error', 'Failed to update habyt')
    } finally {
      setIsLoading(false)
    }
  }

  if (!params.id) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ThemedText type="title">Update Habyt</ThemedText>
        
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
            title="Update"
            onPress={() => void handleUpdate()}
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