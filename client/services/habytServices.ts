import { config } from '@/constants/config'
import { handleResponse, safeFetch, handleHeaders } from '@/utils/api'

import type { Habyt, HabytCreateRequest, HabytUpdateRequest, HabytDeleteRequest } from '@shared/types/habyt.types'

export const habytService = {
  fetchUserHabyts: async (token: string): Promise<Habyt[]> => {
    const response = await safeFetch(`${config.apiBaseUrl}/habyts`, {
      headers: handleHeaders(token)
    })
    return await handleResponse<Habyt[]>(response)
  },

  createHabyt: async ({ title, description, token }: HabytCreateRequest): Promise<Habyt> => {
    const response = await safeFetch(`${config.apiBaseUrl}/habyts`, {
      method: 'POST',
      headers: handleHeaders(token, true),
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
      headers: handleHeaders(token, true),
      body: JSON.stringify(body)
    })

    return await handleResponse<Habyt>(response)
  },

  deleteHabyt: async ({ id, token }: HabytDeleteRequest): Promise<void> => {
    const response = await safeFetch(`${config.apiBaseUrl}/habyts/${id}`, {
      method: 'DELETE',
      headers: handleHeaders(token)
    })

    await handleResponse(response)
  }
}
