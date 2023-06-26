import type { FC } from 'react'
import classNames from 'classnames'

export type AppStatus =
  | 'Running'
  | 'Deploying'
  | 'Deployed'
  | 'DeploymentError'
  | 'Deleting'
  | 'Updating'

interface Props {
  className?: string
  status: AppStatus
}

type DotColours = Record<AppStatus, string>

const DOT_COLOURS: DotColours = {
  Deleting: 'bg-yellow-600',
  Deploying: 'bg-yellow-600',
  Deployed: 'bg-green-500',
  DeploymentError: 'bg-red-600',
  Running: 'bg-green-500',
  Updating: 'bg-yellow-600',
}

export const Status: FC<Props> = ({ status, className }) => {
  const dotColour = DOT_COLOURS[status]

  return (
    <p className={classNames('text-sm flex items-center', className)}>
      <span className="flex h-2 w-2 relative mr-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColour} opacity-75`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${dotColour}`}
        />
      </span>
      {status}
    </p>
  )
}
