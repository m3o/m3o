import type { ReactElement } from 'react'
import type { Func } from 'm3o/function'
import { BackButtonLink, Button } from '@/components/ui'
import { Status, AppStatus } from '@/components/pages/Cloud'

type Props = {
  func: Func
  onUpdateClick: VoidFunction
  isUpdating: boolean
}

export function FunctionHeader({
  func,
  onUpdateClick,
  isUpdating,
}: Props): ReactElement {
  return (
    <div className="p-8 border-b tbc">
      <BackButtonLink href="/cloud/functions">Back to functions</BackButtonLink>
      <div className="flex justify-between">
        <div className="flex">
          <div className="border-r tbc pr-10">
            <p className="text-zinc-400 text-sm">Function:</p>
            <h1 className="font-bold text-lg">{func.name}</h1>
          </div>
          <div className="border-r tbc px-6">
            <p className="text-zinc-400 text-sm">Runtime:</p>
            <h2 className="font-bold text-lg">{func.runtime}</h2>
          </div>
          <div className="border-r tbc px-6">
            <p className="text-zinc-400 text-sm">Region:</p>
            <h2 className="font-bold text-lg">{func.region}</h2>
          </div>
          <div className="px-6">
            <p className="text-zinc-400 text-sm">Status:</p>
            <Status
              status={func.status as AppStatus}
              className="text-lg font-bold text-white"
            />
          </div>
        </div>
        <Button onClick={onUpdateClick} loading={isUpdating}>
          Update
        </Button>
      </div>
    </div>
  )
}
