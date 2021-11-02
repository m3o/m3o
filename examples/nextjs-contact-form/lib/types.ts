export interface ContactFormFields {
  email: string
  message: string
  name: string
}

export interface ApiErrorResponse {
  error: {
    message: string
  }
}
