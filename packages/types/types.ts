import type { NextApiResponse } from 'next'

export interface SendNextError {
  message: string
  res: NextApiResponse
  statusCode: number
}

export interface M3ORequestError {
  Id: string
  Code: number
  Detail: string
  Status: string
}

export interface RequestError {
  error: { message: string }
}

export interface ApiError {
  message: string
}

export interface ApiHookProps {
  onSuccess?: VoidFunction
  onError?: (error: ApiError) => void
}
