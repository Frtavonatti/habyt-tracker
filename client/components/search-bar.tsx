import { StyleSheet } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedView } from "./themed-view"
import { ThemedButton } from "./themed-button"
import { ThemedTextInput } from "./themed-text-input"

interface SearchHeaderProps {
  search: string
  setSearch: (text: string) => void
  handleCreate: () => void
}

export const SearchHeader = ({ handleCreate, search, setSearch }: SearchHeaderProps) => {
  const insets = useSafeAreaInsets()

  return (
    <ThemedView style={[
      styles.searchBar,
      { paddingTop: insets.top + 16 }
    ]}>
      <ThemedTextInput
        style={styles.searchInput}
        placeholder="Search habyts..."
        value={search}
        onChangeText={(text) => { setSearch(text) }}
      />
      <ThemedButton
        title="+"
        size="medium"
        onPress={handleCreate}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
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
