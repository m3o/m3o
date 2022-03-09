import type { CreateRequest } from 'm3o/db'
import type { RunRequest } from 'm3o/app'
import type { DeployRequest } from 'm3o/function'

interface Field {
  key: string
  value: string
}

export type AddAppFormValues = RunRequest & {
  env_vars: Field[]
}

export type AddFunctionFormValues = DeployRequest & {
  env_vars: Field[]
}

export type AddDatabaseFormValues = CreateRequest & {
  record: Field[]
}
