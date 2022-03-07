import type { RunRequest } from 'm3o/app'

interface Field {
  key: string
  value: string
}

export type AddAppFormValues = RunRequest & {
  env_vars: Field[]
}
