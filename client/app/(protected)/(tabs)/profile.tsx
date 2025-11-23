import { Image } from 'expo-image'
import { StyleSheet } from 'react-native'

import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import reactLogo from '@/assets/images/react-logo.png'

export default function TabTwoScreen() {
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
    </ParallaxScrollView>

    // Here goes a HabytHeatmapComponent
  )
}

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    gap: 12
  },
})
