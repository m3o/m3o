import type { FC } from 'react'
import type { PricingItem } from '@/types'
import { returnFormattedEndpointName, getPrice } from '@/utils/api'

export const ApiPriceBreakdown: FC<PricingItem> = ({
  icon,
  display_name,
  pricing,
}) => {
  return (
    <div className="py-4">
      <h3 className="text-lg font-bold text-black mb-4 dark:text-white">
        {display_name}
      </h3>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden border border-zinc-300 dark:border-zinc-600 border-solid">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                <thead className="bg-zinc-50 dark:bg-zinc-900">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                      Endpoint
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
                      Per request
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-200 text-zinc-800 dark:divide-zinc-700 dark:bg-zinc-900">
                  {Object.keys(pricing).map(key => (
                    <tr key={key}>
                      <td className="px-6 py-4 whitespace-nowrap w-1/2 text-sm">
                        {returnFormattedEndpointName(key)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-1/2 text-sm">
                        {getPrice({ pricing, key })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
