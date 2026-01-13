import { Image } from 'expo-image'
import { StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'

import { useRequireAuth } from '@/hooks/use-auth'
import { habytService } from '@/services/habytServices'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import { HabytList } from '@/components/habyt-list'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import reactLogo from '@/assets/images/react-logo.png'

import type { Habyt } from '@shared'

export default function TabTwoScreen() {
  const { token } = useRequireAuth()
  const [habyts, setHabyts] = useState<Habyt[]>([])

  useEffect(() => {
    async function fetchHabyts() {
      try {
        const response = await habytService.fetchUserHabyts(token)
        setHabyts(response)
      } catch (error) {
        console.log('Failed to fetch habits:', error)
      }
    }
    void fetchHabyts()
  }, [token])

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.userContainer}>
        <Image
          source={reactLogo}
          style={{ height: 100, width: 100, borderRadius: 100 }}
        ></Image>
        <ThemedView>
          <ThemedText type='subtitle'>Username</ThemedText>
          <ThemedText>Max streak: X days </ThemedText>
        </ThemedView>
      </ThemedView>

      <HabytList
        data={habyts}
      />
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    gap: 12
  },
})
