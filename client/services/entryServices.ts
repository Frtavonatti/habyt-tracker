import { config } from "@/constants/config"
import { handleResponse, safeFetch } from "@/utils/api"

import { Entry } from "@shared"

const habytEntriesUrl = (id: string) => (`${config.apiBaseUrl}/habyts/${id}/entries`)
const entryUrl = (id: string) => (`${config.apiBaseUrl}/${id}`)

export const entryService = {
  fetchAll: async (id: string, token: string) => {
    const response = await fetch(`${habytEntriesUrl(id)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    return await handleResponse<Entry[]>(response)
  },

  createEntry: async ({ id, token, timeSpentMinutes, completed }) => {
    const body = { timeSpentMinutes, completed }

    const response = await safeFetch(habytEntriesUrl(id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })

    return await handleResponse<Entry>(response)
  },
}
