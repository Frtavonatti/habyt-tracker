import type Habyt from "../models/habyt.js"

export interface HabytCreateBody {
  title: string
  description?: string | null
  token?: string
  decodedToken?: { id: string, username: string } | null
}

export interface HabytUpdateBody {
  title: string
  description: string | null
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

// Services
export interface HabytCreateData {
  title: string,
  description: string | null,
  userId: string 
}

export interface HabytUpdateData extends HabytCreateData {
  id: string,
}

export type HabytUpdateResult = { habyt: Habyt } | { error: string } 