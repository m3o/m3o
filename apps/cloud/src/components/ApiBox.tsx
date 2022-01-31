import type { FC, ComponentType, ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/outline'

export interface Props {
  icon: ComponentType<ComponentProps<'svg'>>
  linkTo: string
  title: string
  subTitle: string
}

export const ApiBox: FC<Props> = ({ icon: Icon, linkTo, title, subTitle }) => {
  return (
    <div className="p-6 border border-gray-700 rounded-md hover:bg-gray-800 transition-colors">
      <Link to={linkTo}>
        <Icon className="w-6" />
        <h3 className="font-bold text-3xl my-2">{title}</h3>
        <p className="text-gray-400 text-lg flex items-center">
          {subTitle} <ArrowRightIcon className="w-4 ml-2" />
        </p>
      </Link>
    </div>
  )
}
