import type { FC } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/outline'

interface Props {
  className?: string
}

export const AddAppLink: FC<Props> = ({ className }) => {
  return (
    <Link
      className={classNames('btn inline-flex items-center', className)}
      to="/apps/add"
    >
      <PlusIcon className="w-4 mr-2" />
      Add App
    </Link>
  )
}
