import { FC } from 'react'
import { useBillingContext } from '@/providers'
import classNames from 'classnames'
import { TrashIcon } from '@heroicons/react/outline'

interface CardsProps {
  cards: Card[]
}

export const Cards: FC<CardsProps> = ({ cards }) => {
  const { setCardToDelete } = useBillingContext()

  if (!cards.length) {
    return <div>No payment methods added</div>
  }

  return (
    <div className="my-6">
      {cards.map(card => (
        <div
          key={card.id}
          className={classNames(
            'w-full text-left p-6 flex items-center justify-between text-sm bg-white dark:bg-zinc-900 rounded-lg mb-2',
          )}>
          <span>**** {card.last_four}</span>
          <div>
            <span>{card.expires}</span>
            <button
              className="ml-4 p-3 rounded-full bg-zinc-900 dark:bg-zinc-700 text-white"
              onClick={() => setCardToDelete(card)}>
              <TrashIcon className="w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

{
  /* <Card
  {...card}
  key={card.id}
  onDeleteClick={() => setCardToDelete(card)}
/> */
}
