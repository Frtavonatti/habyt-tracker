import { useEffect, useState } from 'react'
import { StyleSheet, FlatList, Button } from 'react-native'

import { config } from '@/constants/config'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import HabytCard from '@/components/habytCard'
import { ThemedView } from '@/components/themed-view'
import ThemedTextInput from '@/components/themed-text-input'

import type { Habyt } from '../../../../shared/src/habyt.types'

export default function HomeScreen() {
  const [habyts, setHabyts] = useState<Habyt[]>([])
console.log('API URL:', config.apiBaseUrl)

  useEffect(() => {
    async function fetchHabyts() {
      const response = await fetch(`${config.apiBaseUrl}/habyts`)
      if (!response.ok)
        throw new Error(`Response status: ${response.status}`)
      
      const result = (await response.json()) as Habyt[]
      setHabyts(result)
    }
    void fetchHabyts()
  }, [])


  return (
    <ParallaxScrollView>
      <ThemedView style={styles.searchBar}>
        <ThemedTextInput style={styles.searchInput}></ThemedTextInput>
        <Button title="<>"></Button>
      </ThemedView>

      <FlatList
        data={habyts}
        renderItem={({item}) => <HabytCard {...item} />}
        keyExtractor={(item) => item.id}
      />
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
  },
})
