import type { Func } from 'm3o/function'
import { FunctionEditAndCreate } from './FunctionEditAndCreate'

type Props = {
  func: Func
}

export function FunctionSourceCodeTab({ func }: Props) {
  return (
    <FunctionEditAndCreate
      onSubmit={console.log}
      initialValue={func.source}
      submitButtonText="Update"
    />
  )
}
