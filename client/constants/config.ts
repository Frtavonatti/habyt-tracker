import Constants from 'expo-constants'
import { Platform } from 'react-native'

function getApiUrlFromExpoDevServer(): string | null {
  const hostUri = Constants.expoConfig?.hostUri
  if (hostUri) {
    const host = hostUri.split(':')[0]
    return `http://${host}:3000/api`
  }
  return null
}

function getDefaultApiUrl(): string {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api'
  }
  return 'http://localhost:3000/api'
}

export const config = {
  apiBaseUrl: 
    getApiUrlFromExpoDevServer() ??
    (Constants.expoConfig?.extra?.apiBaseUrl as string) ?? 
    getDefaultApiUrl(),
}