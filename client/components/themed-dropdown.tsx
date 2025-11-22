import { useState } from "react"
import { Modal, Pressable, Text, View, StyleSheet, FlatList } from "react-native"
import { useThemeColor } from "@/hooks/use-theme-color"

interface Option { label: string; value: string }

interface ThemedDropdownProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export default function ThemedDropdown({
  options,
  value,
  onValueChange,
  placeholder = "Selecciona una opción",
}: ThemedDropdownProps) {
  const [visible, setVisible] = useState(false)
  const textColor = useThemeColor({}, 'text')
  const backgroundColor = useThemeColor({}, 'background')
  const borderColor = useThemeColor({}, 'icon')

  const selectedLabel = options.find(opt => opt.value === value)?.label ?? placeholder

  return (
    <>
      <Pressable
        style={[
          styles.input,
          { backgroundColor, borderColor },
        ]}
        onPress={() => setVisible(true)}
      >
        <Text style={{ color: textColor }}>{selectedLabel}</Text>
      </Pressable>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={[styles.dropdown, { backgroundColor, borderColor }]}>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onValueChange(item.value)
                    setVisible(false)
                  }}
                >
                  <Text style={{ color: textColor }}>{item.label}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    justifyContent: "center",
    minHeight: 44,
  },
  overlay: {
    flex: 1,
    backgroundColor: "#0006",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 200,
    paddingVertical: 8,
    maxHeight: 200,
  },
  option: {
    padding: 12,
  },
})