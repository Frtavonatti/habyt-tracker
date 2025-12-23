interface ErrorResponse {
  error: string
  details?: unknown
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
   super(message)
   this.name = 'ApiError' 
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network error. Please check your connection.') {
    super(message)
    this.name = 'NetworkError'
  }
}

export const safeFetch = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  try {
    return await fetch(url, options)
  } catch {
    throw new NetworkError()
  }
}

export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorData: ErrorResponse
    try {
      errorData = await response.json() as ErrorResponse
    } catch {
      throw new ApiError(
        response.status,
        response.statusText || 'Invalid server response'
      )
    }

    throw new ApiError(
      response.status, 
      errorData.error || 'Unknown Error',
      errorData.details
    )
  }

  if (response.status === 204)
    return undefined as T

  return await response.json() as T
}

export const handleHeaders = (token: string, hasBody = false) => {
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`
  }

  if (hasBody) {
    headers['Content-Type'] = 'application/json'
  }

  return headers
}
