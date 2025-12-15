import { config } from "@/constants/config"
import { handleResponse } from "@/utils/api"

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

    return await handleResponse<LoginResponse>(response)
  },

  async register({ username, name, password, email }: UserCreateBody): Promise<void> {
    const response = await fetch(`${config.apiBaseUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, name, password, email }),
    })

    await handleResponse(response)
  }
}