import { useEffect, useState } from 'react'
import { StyleSheet, FlatList, Button } from 'react-native'

import ParallaxScrollView from '@/components/parallax-scroll-view'
import Habyt from '@/components/habyt'
import { ThemedView } from '@/components/themed-view'
import ThemedTextInput from '@/components/themed-text-input'

export default function HomeScreen() {
  const [habyts, setHabyts] = useState()

  useEffect(() => {
    async function fetchHabyts() {
      const response = await fetch('http://192.168.1.200:3000/api/habyts')
      if (!response.ok)
        throw new Error(`Response status: ${response.status}`)
      
      const result = await response.json()
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
        renderItem={({item}) => <Habyt props={item} /> }
        keyExtractor={item => item.id}
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
