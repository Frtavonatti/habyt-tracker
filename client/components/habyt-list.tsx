import { FlatList, StyleSheet } from "react-native"

import { HabytCard } from "./habyt-card"
import { useThemeColor } from "@/hooks/use-theme-color"

import type React from "react"
import type { Habyt } from "@shared"

interface HabytListProps {
  data: Habyt[]
  handleEdit?: (habyt: Habyt) => void
  handleDelete?: (habyt: Habyt) => Promise<void>
  searchHeader?: React.ReactElement
  editableEntries?: boolean
}

export const HabytList = ({ data, handleEdit, handleDelete, editableEntries = false, searchHeader }: HabytListProps) => {
  const backgroundColor = useThemeColor({}, 'background')

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <HabytCard
          {...item}
          onEdit={() => handleEdit?.(item)}
          onDelete={() => void handleDelete?.(item)}
          editableEntries={editableEntries}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      style={{ backgroundColor }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={searchHeader ?? null}
    />
  )
}

const styles = StyleSheet.create({
  listContent: {
    gap: 16,
  },
})
