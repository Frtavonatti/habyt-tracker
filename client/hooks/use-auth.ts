import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useRequireAuth() {
  const { state } = useAuth()
  
  if (state.status !== 'authenticated') {
    throw new Error('useRequireAuth must be used in protected routes')
  }
  
  return {
    token: state.token,
    logout: useAuth().logout
  }
}