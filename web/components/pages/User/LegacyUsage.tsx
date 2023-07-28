import type { FC } from 'react'
import type { Usage, UsageItem } from '@/types'
import ArrowRightIcon from '@heroicons/react/outline/ArrowRightIcon'
import Link from 'next/link'
import { useLegacyUsage } from '@/hooks'
import { Routes } from '@/lib/constants'
import { Spinner } from '@/components/ui'

interface UsageTableItem {
  name: string
  requestsAmount: number
}

interface Props {
  showAllResults?: boolean
}

function reduceRecordsToNumber(records: UsageItem['records']) {
  const date = new Date()
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  const time = Math.floor(first.getTime() / 1000)

  return records.reduce((num, item) => {
    if (parseInt(item.date, 10) >= time) {
      num = parseInt(item.requests, 10) + num
      return num
    } else {
      return num
    }
  }, 0)
}

function formatDataForTable(data: Usage): UsageTableItem[] {
  return Object.keys(data)
    .map(key => {
      const { records } = data[key]

      return {
        name: key,
        requestsAmount: reduceRecordsToNumber(records),
      }
    })
    .sort((a, b) => b.requestsAmount - a.requestsAmount)
}

function getPercentageBasedOnMax(requestsAmount: number, max: number): number {
  if (requestsAmount == 0) {
    return 0.1
  }

  if (max == 0) {
    return 0.1
  }

  return (requestsAmount / max) * 100
}

export const LegacyUsage: FC<Props> = ({ showAllResults = false }) => {
  const { data } = useLegacyUsage()

  if (!data) {
    return <Spinner />
  }

  const formattedTableData = formatDataForTable(data.usage)

  const maxRequestsAmount = Math.max(
    ...formattedTableData.map(item => item.requestsAmount),
  )

  const requestsTotal = formattedTableData.reduce(
    (num, item) => (num = item.requestsAmount + num),
    0,
  )

  const results = showAllResults
    ? formattedTableData
    : formattedTableData.slice(0, 10)

  return (
    <div className="p-8 md:p-10 tbgc rounded-lg mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h5 className="font-bold text-xl text-black dark:text-white">
            Your Usage
          </h5>
          <p className="text-sm mt-2">
            Request quota: {Number(data.quota_remaining).toLocaleString()}
          </p>
        </div>
        {!showAllResults && (
          <Link href={Routes.UserUsage}>
            <a className="md:flex items-center text-sm hidden">
              See all usage <ArrowRightIcon className="w-4 ml-2" />
            </a>
          </Link>
        )}
      </div>
      {Object.keys(data).length ? (
        <div className="max-w-3xl border border-zinc-200 rounded-md dark:border-zinc-600">
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-zinc-200 dark:border-zinc-600">
            <div className="py-2 px-4 text-zinc-500 text-sm flex items-center dark:text-zinc-100">
              Service
            </div>
            <div className="col-span-2 hidden md:block">&nbsp;</div>
            <div className="py-2 px-4 text-zinc-500 dark:text-zinc-100 text-sm">
              Requests <span className="text-xs">(Total: {requestsTotal})</span>
            </div>
          </div>
          {results.map(item => {
            const percentage = getPercentageBasedOnMax(
              item.requestsAmount,
              maxRequestsAmount,
            )

            return (
              <div
                key={item.name}
                className="grid grid-cols-2 md:grid-cols-4 items-center h-8 border-b tbc last:border-0">
                <div className=" h-full flex items-center font-medium text-sm px-4 dark:border-zinc-600 dark:text-white">
                  {item.name}
                </div>
                <div className="hidden md:block col-span-2  bg-pink-50 h-full dark:bg-zinc-800">
                  <div
                    className=" bg-pink-600 h-full dark:bg-pink-300"
                    style={{
                      width: `${percentage}%`,
                      opacity: percentage / 100,
                    }}></div>
                </div>
                <div className="h-full flex items-center px-4 text-sm dark:border-zinc-600 dark:text-white">
                  {item.requestsAmount}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p>
          No usage found. To start using our APIs, please see our{' '}
          <Link href={Routes.GettingStarted}>getting start guide.</Link>
        </p>
      )}
    </div>
  )
}
