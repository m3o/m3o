import type { FC } from 'react'
import Link from 'next/link'
import { useGetCurrentBalance } from '@/hooks'
import { Routes } from '@/lib/constants'
import { Spinner } from '@/components/ui'

export const Balance: FC = () => {
  const { data = 0, isLoading } = useGetCurrentBalance()

  return (
    <div className="bg-zinc-900 dark:bg-zinc-800 text-white">
      <h5 className="font-bold text-xl mb-4">Balance</h5>
      {isLoading ? (
        <Spinner />
      ) : (
        <p className="text-3xl dark:text-white">
          {data.toFixed(6)} M3O
        </p>
      )}
      <Link href={Routes.UserBilling}>
        <a className="block mt-4 text-xs bg-indigo-600 p-4 rounded-lg font-bold text-white align-middle text-center dark:text-white">
          Add credit
        </a>
      </Link>
    </div>
  )
}
