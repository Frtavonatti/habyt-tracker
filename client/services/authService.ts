import { config } from "@/constants/config"
import type { LoginBody, LoginResponse, UserCreateBody } from "@shared/index"

export const authService = {
  async login({ username, password }: LoginBody): Promise<LoginResponse> {
    const response = await fetch(`${config.apiBaseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    return await response.json() as LoginResponse
  },

  async register({ username, name, password, email }: UserCreateBody): Promise<void> {
    const response = await fetch(`${config.apiBaseUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, name, password, email }),
    })

    if (!response.ok) {
      throw new Error('Registration failed')
    }
  }
}