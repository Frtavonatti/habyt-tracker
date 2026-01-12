import { useState, useCallback, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'

import { useRequireAuth } from '@/hooks/use-auth'
import { habytService } from '@/services/habytServices'
import { HabytList } from '@/components/habyt-list'
import { SearchHeader } from '@/components/search-bar'
import { ThemedView } from '@/components/themed-view'

import type { Habyt } from '@shared/types/habyt.types'

export default function HomeScreen() {
  const { token } = useRequireAuth()
  const [habyts, setHabyts] = useState<Habyt[]>([])
  const [search, setSearch] = useState("")
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
    }, [token])
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

  const filteredHabyts = useMemo(() => {
    if (!search) return habyts
    return habyts.filter(habyt =>
      habyt.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [habyts, search])


  return (
    <ThemedView style={styles.container}>
      <HabytList
        data={filteredHabyts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        searchHeader={<SearchHeader
          handleCreate={createHabyt}
          search={search}
          setSearch={setSearch}
        />}
        editableEntries={true}
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
})
