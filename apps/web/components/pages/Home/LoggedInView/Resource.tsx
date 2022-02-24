import type { FC } from 'react'
import Link from 'next/link'
import ArrowRightIcon from '@heroicons/react/outline/ArrowRightIcon'

export interface ResourceProps {
  title: string
  tagLine: string
  link: string
  linkText: string
}

export const Resource: FC<ResourceProps> = ({
  title,
  tagLine,
  link,
  linkText,
}) => {
  return (
    <div className="card p-6">
      <div className="mb-8">
        <h2 className="font-bold text-lg">{title}</h2>
        <p className="mt-2 font-light">{tagLine}</p>
      </div>
      <Link href={link}>
        <a className="mt-auto inline-flex items-center">
          {linkText} <ArrowRightIcon className="w-4 ml-2" />
        </a>
      </Link>
    </div>
  )
}
