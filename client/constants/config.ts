import Constants from 'expo-constants'
import { Platform } from 'react-native'

function getApiUrl(): string {
  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api'
  }

  // 2. For mobile attempt to use Expo web server id
  const hostUri = Constants.expoConfig?.hostUri
  if (hostUri) {
    const host = hostUri.split(':')[0]
    return `http://${host}:3000/api`
  }

  // 3. Env variables fallback 
  const envUrl = Constants.expoConfig?.extra?.apiBaseUrl as string | undefined
  if (envUrl) {
    return envUrl
  }

  // 4. Last resource
  return Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/api'
    : 'http://localhost:3000/api'
}

export const config = {
  apiBaseUrl: getApiUrl()
}

console.log('🚀 API URL:', config.apiBaseUrl, '| Platform:', Platform.OS)

// function getApiUrlFromExpoDevServer(): string | null {
//   const hostUri = Constants.expoConfig?.hostUri
//   if (hostUri) {
//     const host = hostUri.split(':')[0]
//     return `http://${host}:3000/api`
//   }
//   return null
// }
//
// function getDefaultApiUrl(): string {
//   if (Platform.OS === 'android') {
//     return 'http://10.0.2.2:3000/api'
//   }
//   return 'http://localhost:3000/api'
// }
//
// export const config = {
//   apiBaseUrl: 
//     getApiUrlFromExpoDevServer() ??
//     (Constants.expoConfig?.extra?.apiBaseUrl as string) ?? 
//     getDefaultApiUrl(),
// }