import { StyleSheet } from "react-native"

import { ThemedView } from "./themed-view"
import { ThemedText } from "./themed-text"

import type { Habyt } from '@shared/habyt.types'

export default function HabytCard ({ title, description }: Habyt) {
  return (
    <ThemedView style={styles.habytContainer}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <ThemedText>{description}</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  habytContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
})