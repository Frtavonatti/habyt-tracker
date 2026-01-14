import { Modal, StyleSheet, Pressable, type ViewStyle } from 'react-native'
import { ThemedView } from './themed-view'

interface ThemedModalProps {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  style?: ViewStyle
}

export function ThemedModal({ visible, onClose, children, style }: ThemedModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.modalContainer, style]} onPress={(e) => e.stopPropagation()}>
          <ThemedView style={styles.modalContent}>
            {children}
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})
