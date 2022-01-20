import type { Account } from 'm3o/user'

export interface CreateUserFields extends Account {
  password: string
}
