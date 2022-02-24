import type { FC } from 'react'
import AdjustmentsIcon from '@heroicons/react/outline/AdjustmentsIcon'

interface Props {
  selectedCategoriesLength: number
  onClick: VoidFunction
}

export const FiltersButton: FC<Props> = ({
  onClick,
  selectedCategoriesLength,
}) => {
  return (
    <button
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 btn z-40 md:hidden flex items-center"
      onClick={onClick}
      data-testid="explore-select-filters">
      <AdjustmentsIcon className="w-4 mr-2" />
      {selectedCategoriesLength
        ? `(${selectedCategoriesLength}) categor${
            selectedCategoriesLength > 1 ? 'ies' : 'y'
          }`
        : 'Select filters'}
    </button>
  )
}
