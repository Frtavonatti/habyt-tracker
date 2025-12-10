import { Modal, StyleSheet, TouchableOpacity, Pressable, type View } from "react-native"
import { useState, useRef } from "react"

import { ThemedView } from "./themed-view"
import { ThemedText } from "./themed-text"
import { IconSymbol } from "./ui/icon-symbol"
import { useThemeColor } from "@/hooks/use-theme-color"

interface MenuOption {
  label: string
  icon: 'pencil' | 'trash'
  onPress: () => void
  variant?: 'default' | 'danger'
}

interface HabytDropdownMenuProps {
  options: MenuOption[]
}

export const HabytDropdownMenu = ({ options }: HabytDropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 })
  const buttonRef = useRef<View>(null)
  const iconColor = useThemeColor({}, 'icon')

  const handleOpen = () => {
    buttonRef.current?.measure((_x: number, _y: number, _width: number, height: number, _pageX: number, pageY: number) => {
      setMenuPosition({
        top: pageY + height,
        right: 16,
      })
      setIsOpen(true)
    })
  }

  const handleOptionPress = (onPress: () => void) => {
    onPress()
    setIsOpen(false)
  }

  return (
    <>
      <TouchableOpacity ref={buttonRef} onPress={handleOpen}>
        <IconSymbol name="ellipsis.vertical.bubble" size={24} color={iconColor} />
      </TouchableOpacity>
      
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsOpen(false)}
        >
          <ThemedView style={[
            styles.menuContainer,
            { 
              position: 'absolute',
              top: menuPosition.top,
              right: menuPosition.right,
            }
          ]}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuOption}
                onPress={() => handleOptionPress(option.onPress)}
              >
                <IconSymbol 
                  name={option.icon} 
                  size={20} 
                  color={option.variant === 'danger' ? '#dc3545' : (iconColor)} 
                />
                <ThemedText 
                  style={[
                    styles.menuText,
                    option.variant === 'danger' && styles.dangerText
                  ]}
                >
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    borderRadius: 8,
    padding: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderRadius: 4,
  },
  menuText: {
    fontSize: 16,
  },
  dangerText: {
    color: '#dc3545',
  },
})


