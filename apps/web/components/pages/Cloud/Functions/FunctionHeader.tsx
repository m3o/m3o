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
      <div className="md:flex justify-between">
        <div className="md:flex">
          <div className="border-r tbc md:pr-10 mb-4 md:mb-0">
            <p className="text-zinc-400 text-sm">Function:</p>
            <h1 className="font-bold xl:text-lg">{func.name}</h1>
          </div>
          <div className="md:border-r tbc md:px-6 mb-4 md:mb-0">
            <p className="text-zinc-400 text-sm">Runtime:</p>
            <h2 className="font-bold xl:text-lg">{func.runtime}</h2>
          </div>
          <div className="md:border-r tbc md:px-6 mb-4 md:mb-0">
            <p className="text-zinc-400 text-sm">Region:</p>
            <h2 className="font-bold xl:text-lg">{func.region}</h2>
          </div>
          <div className="md:px-6">
            <p className="text-zinc-400 text-sm">Status:</p>
            <Status
              status={func.status as AppStatus}
              className="xl:text-lg font-bold text-white"
            />
          </div>
        </div>
        <Button
          onClick={onUpdateClick}
          loading={isUpdating}
          className="w-full my-6 md:w-auto md:my-0">
          Update
        </Button>
      </div>
      <a
        href={func.url}
        className="inline-block mt-2 text-sm"
        target="_blank"
        rel="noreferrer">
        {func.url}
      </a>
    </div>
  )
}
