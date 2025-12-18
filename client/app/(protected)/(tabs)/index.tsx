import { useState, useCallback } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter, useFocusEffect } from 'expo-router'

import { useRequireAuth } from '@/hooks/use-auth'
import { habytService } from '@/services/habytServices'
import { useThemeColor } from '@/hooks/use-theme-color'
import { HabytCard } from '@/components/habyt-card'
import { ThemedView } from '@/components/themed-view'
import { ThemedTextInput } from '@/components/themed-text-input'
import { ThemedButton } from '@/components/themed-button'

import type { Habyt } from '@shared/types/habyt.types'

export default function HomeScreen() {
  const { token } = useRequireAuth()
  const [habyts, setHabyts] = useState<Habyt[]>([])
  const insets = useSafeAreaInsets()
  const backgroundColor = useThemeColor({}, 'background')
  const router = useRouter()

  useFocusEffect(
    useCallback(() => {
      let isActive = true
      async function fetchHabyts() {
        try {
          const response = await habytService.fetchUserHabyts(token)
          if (isActive) setHabyts(response)
        } catch (error) {
          console.error('Failed to fetch habyts:', error)
        }
      }
      void fetchHabyts()
      return () => { isActive = false }
    }, [])
  )

  const createHabyt = () => {
    router.push('/(protected)/create-habyt-modal')
  }

  const handleEdit = (habyt: Habyt) => {
    router.push({
      pathname: '/(protected)/update-habyt-modal',
      params: {
        id: habyt.id,
        title: habyt.title,
        description: habyt.description ?? ''
      }
    })
  }

  const handleDelete = async (habyt: Habyt) => {
    try {
      await habytService.deleteHabyt({ id: habyt.id, token })
      setHabyts(prev => prev.filter(h => h.id !== habyt.id))
    } catch (error) {
      console.log(error)
    }
  }

  const SearchHeader = () => (
    <ThemedView style={[
      styles.searchBar,
      { paddingTop: insets.top + 16 }
    ]}>
      <ThemedTextInput
        style={styles.searchInput}
        placeholder="Search habyts..."
      />
      <ThemedButton
        title="+"
        size="medium"
        onPress={createHabyt}
      />
    </ThemedView>
  )

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={habyts}
        renderItem={({ item }) => (
          <HabytCard
            {...item}
            onEdit={() => handleEdit(item)}
            onDelete={() => void handleDelete(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={SearchHeader}
        contentContainerStyle={styles.listContent}
        style={{ backgroundColor }}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
  },
  listContent: {
    gap: 16,
  },
})
