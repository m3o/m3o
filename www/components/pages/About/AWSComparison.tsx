import type { FC } from 'react'
import CheckCircleIcon from '@heroicons/react/outline/CheckCircleIcon'
import XCircleIcon from '@heroicons/react/outline/XCircleIcon'

export const AWSComparison: FC = () => {
  return (
    <section className="py-8 md:py-16 dark:bg-zinc-800 bg-zinc-50 border-t border-zinc-300 dark:border-zinc-600">
      <div className="m3o-container">
        <h1 className="font-bold text-2xl md:text-3xl text-center mb-8 dark:text-white text-black">
          M3O vs AWS
        </h1>

        <div className="md:grid md:grid-cols-2 md:gap-4 dark:text-white font-light">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="border overflow-hidden border-b border-zinc-300 dark:border-zinc-600 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                    <thead className="bg-zinc-50 dark:bg-zinc-900">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          Feature
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          AWS
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          M3O
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-700">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              Developer Friendly
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm ">
                            <XCircleIcon className="w-6" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <CheckCircleIcon className="w-6" />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              Simple to integrate
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm ">
                            <XCircleIcon className="w-6" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <CheckCircleIcon className="w-6" />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              Predictable Pricing
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm ">
                            <XCircleIcon className="w-6" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <CheckCircleIcon className="w-6" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="right md:p-6 mt-6 md:mt-0">
            <p className="mb-4 mt-4">
              Cloud complexity is at full throttle. What started as a promising
              way for developers to rapidly build scalable web services has
              turned into the anti pattern for the next generation. We need a
              faster, simpler and more affordable way to use cloud services.
            </p>
            <p className="mb-4">
              M3O was built with this in mind. To help developers 10x without
              dealing with the complexity of AWS. We&apos;re rebuilding the
              building blocks for the next generation.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
