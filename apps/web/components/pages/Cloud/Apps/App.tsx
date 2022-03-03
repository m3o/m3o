import type { FC, ReactNode } from 'react'
import type { Service } from 'm3o/app'
import { Status, AppStatus } from './Status'

interface Props extends Service {
  headerRight: ReactNode
}

const KEYS: (keyof Service)[] = ['region', 'port', 'repo', 'branch']

export const App: FC<Props> = ({ headerRight, ...props }) => {
  return (
    <div className="p-6 rounded-md tbgc ttc">
      <div className="">
        <div className="flex justify-between">
          <div>
            <h2 className="mb-3">
              <a
                href={props.url}
                target="_blank"
                rel="noreferrer"
                className="font-bold hover:underline text-lg">
                {props.name}
              </a>
            </h2>
            <h3 className="mt-3 text-sm">
              <a
                href={props.url}
                target="_blank"
                rel="noreferrer"
                className="underline text-zinc-300">
                {props.url?.replace('https://', '')}
              </a>
            </h3>
          </div>
          <Status status={props.status as AppStatus} />
        </div>
        {headerRight}
      </div>
      <div className="pt-4 text-zinc-300">
        {KEYS.map(key => (
          <div
            key={key}
            className="grid grid-cols-2 mb-2 last:mb-0 bg-zinc-700 py-2 px-4 rounded-md">
            <p className="text-sm capitalize">{key}</p>
            <p className="text-sm text-ellipsis overflow-hidden">
              {props[key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
