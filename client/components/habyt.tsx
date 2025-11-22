import { StyleSheet } from "react-native"

import { ThemedView } from "./themed-view"
import { ThemedText } from "./themed-text"

export default function Habyt ({ props }) {
  return (
    <ThemedView style={styles.habytContainer}>
      <ThemedText type="subtitle">{props.title}</ThemedText>
      <ThemedText>{props.description}</ThemedText>
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