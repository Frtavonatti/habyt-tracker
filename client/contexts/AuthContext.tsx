import { createContext, useState, useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from "expo-router"
import { authService } from "@/services/authService"

import type { ReactNode } from "react"
import type { LoginBody, UserCreateBody } from "@shared/index"

type AuthState = 
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; token: string }

interface AuthContextType {
  state: AuthState,
  login: (credential: LoginBody) => Promise<void>
  register: (userdata: UserCreateBody) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({ status: 'loading' })

  useEffect(()=> {
    void loadToken()
  }, [])

  const loadToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token')
      if (storedToken)
        setState({ status: 'authenticated', token: storedToken })
      else
        setState({ status: 'unauthenticated' })
    } catch (error) {
      console.error('Error loading token:', error)
      setState({ status: 'unauthenticated' })
    }
  }

  const login = async ({ username, password }: LoginBody) => {
    try {
      const data = await authService.login({ username, password })
      await AsyncStorage.setItem('auth_token', data.token)
      setState({ status: 'authenticated', token: data.token })
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (userData: UserCreateBody) => {
    try {
      await authService.register(userData)
      await login({ username: userData.username, password: userData.password })
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }  

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token')
      setState({ status: 'unauthenticated' })
      router.push('/(auth)/login')
    } catch (error) {
      console.error('Logout error:', error)
      throw error      
    }
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}