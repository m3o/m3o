import type { FC, ReactNode } from 'react'
import type { Service } from 'm3o/app'
import { Status, AppStatus } from './Status'

interface Props extends Service {
  buttons: ReactNode
}

const KEYS: (keyof Service)[] = ['region', 'port', 'repo', 'branch']

export const App: FC<Props> = props => {
  return (
    <div className="p-6 rounded-md tbgc ttc grid lg:grid-cols-5 items-center">
      <div className="lg:col-span-4">
        <h2 className="mb-2">
          <a
            href={props.url}
            target="_blank"
            rel="noreferrer"
            className="font-bold hover:underline text-lg">
            {props.name}
          </a>
        </h2>
        <h3 className="text-sm mb-3">
          <a
            href={props.url}
            target="_blank"
            rel="noreferrer"
            className="underline ">
            {props.url?.replace('https://', '')}
          </a>
        </h3>
        <Status status={props.status as AppStatus} />
        <div className="pt-4  grid lg:flex w-full">
          {KEYS.map(key => (
            <div key={key} className="py-2 lg:flex-1 lg:pl-4 lg:first:pl-0">
              <p className="text-sm capitalize font-bold dark:text-white">
                {key}
              </p>
              <p className="text-sm text-ellipsis overflow-hidden tbc">
                {props[key]}
              </p>
            </div>
          ))}
        </div>
      </div>
      {props.buttons}
    </div>
  )
}
