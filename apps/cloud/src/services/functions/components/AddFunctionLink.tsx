import type { FC } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/outline'

interface Props {
  className?: string
}

export const AddFunctionLink: FC<Props> = ({ className }) => {
  return (
    <Link
      className={classNames('btn inline-flex items-center', className)}
      to="/functions/add"
    >
      <PlusIcon className="w-4 mr-2" />
      Add Function
    </Link>
  )
}
