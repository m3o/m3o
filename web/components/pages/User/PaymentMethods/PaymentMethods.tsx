import type { FC } from 'react'
import PlusIcon from '@heroicons/react/outline/PlusIcon'
import PulseLoader from 'react-spinners/PulseLoader'
import { useGetSavedCards, useAddNewCard } from '@/hooks'
import { Cards } from './Cards'

export const PaymentMethods: FC = () => {
  const onAddNewCard = useAddNewCard()
  const { isLoading, cards } = useGetSavedCards()

  return (
    <div className="mt-8 tbgc p-6 md:p-10 rounded-lg">
      <div className="flex justify-between mb-6 items-baseline">
        <div>
          <h3 className="font-bold text-2xl text-black mb-1 dark:text-white">
            Payment methods
          </h3>
          <p>Please see your saved cards</p>
        </div>
        <button
          className="gradient-bg p-2 rounded-full text-white"
          onClick={onAddNewCard}>
          <PlusIcon className="w-4" />
        </button>
      </div>
      {isLoading ? (
        <PulseLoader size={5} color="black" />
      ) : (
        <Cards cards={cards} />
      )}
    </div>
  )
}
