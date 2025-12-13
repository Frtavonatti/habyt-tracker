import { useRef, useEffect} from 'react'
import { Alert, AppState } from 'react-native'
import { jwtDecode } from 'jwt-decode'

function isTokenExpired (token: string): boolean {
  try {
    const decoded = jwtDecode(token)
    if (!decoded.exp) return true
    
    const expirationTime = decoded.exp * 1000
    const bufferTime = 60 * 1000 // 1 min margin
    return Date.now() >= (expirationTime - bufferTime) 
  } catch {
    return true
  }
}

export function useTokenValidator (
  token: string | null, 
  onExpired: () => void,
  checkInterval = 60000 // 1 min by default
) {
  // - [ ] TO-DO: study useRef and relation to intervals
  const intervalRef = useRef<number | null>(null)
  const hasShownAlert = useRef(false)

  useEffect(() => {
    if (!token) return
    
    const checkExpiration = () => {
      if (isTokenExpired(token) && !hasShownAlert.current) {
        if (intervalRef.current)
          clearInterval(intervalRef.current)
        // - [ ] TO-DO: study alert params/options 
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please login again.',
          [{ 
            text: 'OK', 
            onPress: () => {
              onExpired()
              hasShownAlert.current = false
            }
          }]
        )
        hasShownAlert.current = true
      }
    }

    checkExpiration()

    // Verify periodically
    // - [ ] TO-DO: study set interval | is this derived from useRef?
    intervalRef.current = setInterval(checkExpiration, checkInterval)

    // Verify when app returns to foreground
    // - [ ] TO-DO: study appState
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') 
        checkExpiration()
    })

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      subscription.remove()
    }
  }, [token, onExpired, checkInterval])
}