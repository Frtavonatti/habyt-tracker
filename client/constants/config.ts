import Constants from 'expo-constants'

export const config = {
  apiBaseUrl: (Constants.expoConfig?.extra?.apiBaseUrl as string) ?? 'http://localhost:3000/api',
}