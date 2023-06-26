import type { FC } from 'react'
import type { Card } from '@/types'
import { CheckCircleIcon } from '@heroicons/react/solid'
import classNames from 'classnames'

interface Props {
  cards: Card[]
  handleCardClick: (cardId: string) => void
  selectedCard: string
}

export const PaymentMethods: FC<Props> = ({
  cards,
  handleCardClick,
  selectedCard,
}) => {
  return (
    <div className="mt-8">
      <p className="font-bold">Please select a card:</p>
      <div className="tbc my-6">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={classNames(
              'w-full text-left p-6 border flex items-center justify-between text-sm mb-4 last:mb-0 rounded-lg tbc transition-all',
              {
                'dark:bg-zinc-700 bg-zinc-200 font-medium':
                  selectedCard === card.id,
                'bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700':
                  selectedCard !== card.id,
              },
            )}>
            <div className="flex items-center">
              {selectedCard === card.id && (
                <CheckCircleIcon className="w-5 mr-2" />
              )}
              <span>**** {card.last_four}</span>
            </div>
            <span>{card.expires}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
