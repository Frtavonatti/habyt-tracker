import { useState, useEffect, useCallback } from "react"
import { habytService } from "./services/habytServices"

import type { Habyt } from "@shared"

export function useFetchHabyts(token: string) {
  const [habyts, setHabyts] = useState<Habyt[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchHabyts = useCallback(async () => {
    try {
      const response = await habytService.fetchUserHabyts(token)
      setHabyts(response)
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    setLoading(true)
    setError(null)
    void fetchHabyts()
  }, [fetchHabyts])

  return {
    habyts,
    setHabyts,
    loading,
    error,
    refetch: fetchHabyts
  }
}
