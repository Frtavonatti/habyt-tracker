import { config } from '@/constants/config'

import type { Habyt, HabytCreateRequest, HabytUpdateRequest, HabytDeleteRequest } from '@shared/types/habyt.types'
import { handleResponse, safeFetch } from '@/utils/api'

export const habytService = {
  fetchUserHabyts: async (token: string): Promise<Habyt[]> => {
    const response = await safeFetch(`${config.apiBaseUrl}/habyts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return await handleResponse<Habyt[]>(response)
  },

  createHabyt: async ({ title, description, token }: HabytCreateRequest): Promise<Habyt> => {
    const response = await safeFetch(`${config.apiBaseUrl}/habyts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description })
    })

    return await handleResponse<Habyt>(response)
  },

  updateHabyt: async ({ id, token, title, description }: HabytUpdateRequest): Promise<Habyt> => {
    const body: { title?: string; description?: string | null } = {}

    if (title !== undefined)
      body.title = title
    if (description !== undefined)
      body.description = description

    const response = await safeFetch(`${config.apiBaseUrl}/habyts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })

    return await handleResponse<Habyt>(response)
  },

  deleteHabyt: async ({ id, token }: HabytDeleteRequest): Promise<void> => {
    const response = await safeFetch(`${config.apiBaseUrl}/habyts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    await handleResponse(response)
  }
}
