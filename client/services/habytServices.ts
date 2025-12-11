import { config } from '@/constants/config'

import type { Habyt, HabytCreateRequest, HabytUpdateRequest, HabytDeleteRequest } from '@shared/types/habyt.types'

// TO-DO: Consider switching to a singleton/service layer pattern to improve testability
export const habytService = {
  fetchAllHabyts: async (): Promise<Habyt[]> => {
    const response = await fetch(`${config.apiBaseUrl}/habyts`)
    if (!response.ok)
      throw new Error(`Response status: ${response.status}`)

    const data: unknown = await response.json()
    if (!Array.isArray(data))
      throw new Error('Invalid response format: expected array')

    return data as Habyt[]
  },

  createHabyt: async ({ title, description, token }: HabytCreateRequest): Promise<Habyt> => {
    const response = await fetch(`${config.apiBaseUrl}/habyts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description })
    })

    if (!response.ok)
      throw new Error(`Response status: ${response.status}`)

    return await response.json() as Habyt
  },

  updateHabyt: async ({ id, token, title, description }: HabytUpdateRequest): Promise<Habyt> => {
    const body: { title?: string; description?: string | null } = {}

    if (title !== undefined) 
      body.title = title
    if (description !== undefined)
      body.description = description

    const response = await fetch(`${config.apiBaseUrl}/habyts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })

  if (!response.ok)
    throw new Error(`Response status: ${response.status}`)

    return await response.json() as Habyt
  },

  deleteHabyt: async ({ id, token }: HabytDeleteRequest): Promise<void> => {
    const response = await fetch(`${config.apiBaseUrl}/habyts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok)
      throw new Error(`Response status: ${response.status}`)
  }
}
