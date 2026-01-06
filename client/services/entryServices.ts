import { config } from "@/constants/config"
import { handleResponse, safeFetch, handleHeaders } from "@/utils/api"

import type { Entry, EntryCreateRequest, EntryUpdateRequest } from "@shared"

const habytEntriesUrl = (id: string) => `${config.apiBaseUrl}/habyts/${id}/entries`
const entryUrl = (id: string) => `${config.apiBaseUrl}/entries/${id}`

export const entryService = {
  fetchAll: async (id: string, token: string) => {
    const response = await safeFetch(habytEntriesUrl(id), {
      headers: handleHeaders(token),
    })

    return await handleResponse<Entry[]>(response)
  },

  createEntry: async ({ habytId, token, timeSpentMinutes, completed }: EntryCreateRequest) => {
    const body = {
      timeSpentMinutes,
      completed
    }

    const response = await safeFetch(habytEntriesUrl(habytId), {
      method: 'POST',
      headers: handleHeaders(token, true),
      body: JSON.stringify(body)
    })

    return await handleResponse<Entry>(response)
  },

  updateEntry: async ({ id, token, timeSpentMinutes, completed }: EntryUpdateRequest) => {
    const body: Partial<{ timeSpentMinutes: number | null; completed: boolean }> = {}

    if (timeSpentMinutes !== undefined)
      body.timeSpentMinutes = timeSpentMinutes
    if (completed !== undefined)
      body.completed = completed

    const response = await safeFetch(entryUrl(id), {
      method: 'PATCH',
      headers: handleHeaders(token, true),
      body: JSON.stringify(body)
    })

    return await handleResponse<Entry>(response)
  },

  deleteEntry: async ({ id, token }: { id: string, token: string }) => {
    const response = await safeFetch(entryUrl(id), {
      method: 'DELETE',
      headers: handleHeaders(token)
    })

    await handleResponse(response)
  }
}
