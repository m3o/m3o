import type { FC, ComponentType } from 'react'
import classnames from 'classnames'
import {
  ExclamationCircleIcon,
  ExclamationIcon,
  CheckCircleIcon,
} from '@heroicons/react/outline'

type AlertTypes = 'error' | 'success' | 'warning'

type Icons = {
  [K in AlertTypes]: ComponentType<{ className: string }>
}

export interface Props {
  className?: string
  type?: AlertTypes
  testId?: string
}

const ICONS: Icons = {
  error: ExclamationCircleIcon,
  warning: ExclamationIcon,
  success: CheckCircleIcon,
}

export const Alert: FC<Props> = ({
  type = 'success',
  children,
  className,
  testId,
}) => {
  const Icon = ICONS[type]

  const classes = classnames(
    'p-4 rounded-md md:flex md:items-center',
    className,
    {
      'bg-red-50 text-red-800': type === 'error',
      'bg-yellow-50 text-yellow-800': type === 'warning',
      'bg-green-50 text-green-800': type === 'success',
    },
  )

  return (
    <div className={classes} data-testid={testId}>
      <Icon className="w-6 hidden md:block" />
      <div className="md:ml-6 text-sm md:w-10/12">
        <p className="font-medium">{children}</p>
      </div>
    </div>
  )
}
