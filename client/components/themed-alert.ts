import { Platform, Alert as RNAlert } from 'react-native'

interface AlertButton {
  text: string
  onPress?: () => void
  style?: 'default' | 'cancel' | 'destructive'
}

export const ThemedAlert = {
  alert: (
    title: string,
    message?: string,
    buttons?: AlertButton[]
  ) => {
    if (Platform.OS === 'web') {
      if (!buttons || buttons.length === 0) {
        window.alert(`${title}${message ? `\n\n${message}` : ''}`)
        return
      }

      const fullMessage = `${title}${message ? `\n\n${message}` : ''}`
      
      if (buttons.length === 1) {
        window.alert(fullMessage)
        if (buttons[0].onPress) {
          buttons[0].onPress()
        }
        return
      }

      const actionButton = buttons.find(b => b.style !== 'cancel') ?? buttons[buttons.length - 1]
      const cancelButton = buttons.find(b => b.style === 'cancel')
      
      const confirmed = window.confirm(fullMessage)
      
      if (confirmed && actionButton.onPress) {
        actionButton.onPress()
      } else if (!confirmed && cancelButton?.onPress) {
        cancelButton.onPress()
      }
    } else {
      RNAlert.alert(title, message, buttons)
    }
  }
}
