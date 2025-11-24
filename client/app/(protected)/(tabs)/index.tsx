import { useEffect, useState } from 'react'
import { StyleSheet, FlatList, Button } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { habytService } from '@/services/habytServices'
import { useThemeColor } from '@/hooks/use-theme-color'
import { HabytCard } from '@/components/habytCard'
import { ThemedView } from '@/components/themed-view'
import { ThemedTextInput } from '@/components/themed-text-input'

import type { Habyt } from '../../../../shared/src/habyt.types'

export default function HomeScreen() {
  const [habyts, setHabyts] = useState<Habyt[]>([])
  const insets = useSafeAreaInsets()
  const backgroundColor = useThemeColor({}, 'background')

  useEffect(() => {
    async function fetchHabyts() {
      try {
        const response = await habytService.fetchAllHabyts()
        setHabyts(response)
      } catch (error) {
        console.error('Failed to fetch habyts:', error)
      }
    }
    void fetchHabyts()
  }, [])


  const SearchHeader = () => (
    <ThemedView style={[
      styles.searchBar,
      { paddingTop: insets.top + 16 } // SafeArea + padding
    ]}>
      <ThemedTextInput 
        style={styles.searchInput}
        placeholder="Buscar hábitos..."
      />
      <Button title="+" />
    </ThemedView>
  )

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={habyts}
        renderItem={({item}) => <HabytCard {...item} />}
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
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 48,
  },
  listContent: {
    paddingHorizontal: 4,
    paddingBottom: 32,
    gap: 16,
  },
})
