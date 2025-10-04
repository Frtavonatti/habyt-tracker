export interface CreateHabytBody {
  title: string
  description?: string | null
  token?: string
  decodedToken?: { id: string, username: string } | null
}

export interface HabytResponse {
  id: string
  title: string
  description: string | null
  userId: string
  createdAt: string
  updatedAt: string
}