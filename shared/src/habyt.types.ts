export interface Habyt {
  id: string
  title: string
  description: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface HabytCreateBody {
  title: string
  description?: string | null
  token?: string | null
  decodedToken?: { id: string, username: string } | null
}

export interface HabytUpdateBody {
  title: string
  description: string | null
  decodedToken?: { id: string, username: string } | null
}

export type HabytResponse = Habyt

// Services
export interface HabytCreateData {
  title: string,
  description: string | null,
  userId: string 
}

export interface HabytUpdateData extends HabytCreateData {
  id: string,
}

export interface HabytUpdateResult { 
  habyt: Omit<Habyt, 'createdAt' | 'updatedAt'>
}