import type { Func } from 'm3o/function'
import type { ReactElement } from 'react'
import { useRef } from 'react'
import { Tabs } from '@/components/ui'
import { FunctionHeader } from './FunctionHeader'
import { FunctionLogs } from './Logs'

export type RepoFunctionEditProps = {
  func: Func
  onUpdateClick: (props: { name: string }) => void
  isUpdating: boolean
}

export function RepoFunctionEdit({
  func,
  onUpdateClick,
  isUpdating,
}: RepoFunctionEditProps): ReactElement {
  return (
    <>
      <FunctionHeader
        func={func}
        onUpdateClick={() =>
          onUpdateClick({
            name: func.name as string,
          })
        }
        isUpdating={isUpdating}
      />
      <div className="p-6">
        <h4 className="mb-6 font-bold text-xl">Logs</h4>
        <FunctionLogs />
      </div>
    </>
  )
}
