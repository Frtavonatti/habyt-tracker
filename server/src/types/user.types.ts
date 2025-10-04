export interface CreateUserBody {
  username: string
  name: string
  password: string
  email: string
}

export interface UpdateUsernameBody {
  newUsername: string
}

export interface LoginBody {
  username: string
  password: string
}

export interface UserResponse {
  id: number
  username: string
  name: string
  email: string
}

export interface LoginResponse {
  token: string
  username: string
  name: string
}