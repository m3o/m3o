import type { FC } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/outline'

interface Props {
  className?: string
  name: string
  to: string
}

export const AddButton: FC<Props> = ({ className, name, to }) => {
  return (
    <Link
      className={classNames('btn inline-flex items-center', className)}
      to={to}
    >
      <PlusIcon className="w-4 mr-2" />
      Add {name}
    </Link>
  )
}
