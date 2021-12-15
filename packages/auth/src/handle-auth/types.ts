import type { SendPasswordResetEmailRequest } from 'm3o/user'

type SendPasswordResetEmailOpts = Omit<SendPasswordResetEmailRequest, 'email'>

export interface HandleAuthOpts {
  websiteName?: string
  sendPasswordResetEmailOpts?: SendPasswordResetEmailOpts
}
