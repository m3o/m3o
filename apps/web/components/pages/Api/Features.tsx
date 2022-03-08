import type { FeatureItem } from '@/types'
import { FC } from 'react'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/outline'
import { SubTitle } from '@/components/ui'

interface Props {
  serviceName: string
  features: FeatureItem[]
}

export const Features: FC<Props> = ({ features, serviceName }) => {
  return (
    <>
      <SubTitle className="flex justify-between">
        Features
        <Link href={`/${serviceName}/api`}>
          <a className="text-sm font-light dark:text-indigo-300 underline flex items-center">
            API Reference <ChevronRightIcon className="w-4" />
          </a>
        </Link>
      </SubTitle>
      <table className="min-w-full divide-y divide-zinc-200 mb-6">
        <thead className="border-b border-solid border-zinc dark:border-zinc-700">
          <tr>
            <th className="text-left text-xs font-medium tracking-wider py-3 text-zinc-400">
              Endpoint
            </th>
            <th className="text-left text-xs font-medium tracking-wider py-3 text-zinc-400 px-4">
              Description
            </th>
            <th className="text-left text-xs font-medium tracking-wider py-3 text-zinc-400">
              Credits (per request)
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map(feature => (
            <tr
              key={feature.title}
              className="border-b border-solid border-zinc dark:border-zinc-700">
              <td className="py-3 w-2/12">
                <a
                  href={`/${serviceName}/api#${feature.title.replace(
                    / /g,
                    '',
                  )}`}
                  data-test="feature-link">
                  {feature.title}
                </a>
              </td>
              <td className="py-3 w-8/12 px-4">{feature.description}</td>
              <td className="py-3 w-2/12">
                <span className=" rounded-md">{feature.price}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
