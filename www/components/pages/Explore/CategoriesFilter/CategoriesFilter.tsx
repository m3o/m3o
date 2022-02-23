import type { FC } from 'react'
import { CategoryCheckbox } from './CategoryCheckbox'
import { ClearAllButton } from '@/components/ui'

export interface Props {
  categories: string[]
  handleCategoryChange: (category: string) => void
  onClearAllClick: VoidFunction
  selectedCategories: string[]
}

export const CategoriesFilter: FC<Props> = ({
  categories,
  handleCategoryChange,
  onClearAllClick,
  selectedCategories,
}) => {
  return (
    <div>
      <h3 className="text-zinc-800 mb-4 font-bold dark:text-white">
        Categories
      </h3>
      {!!selectedCategories.length && (
        <ClearAllButton onClick={onClearAllClick} />
      )}
      {categories.map(category => (
        <CategoryCheckbox
          label={category}
          key={category}
          onChange={handleCategoryChange}
          checked={selectedCategories.includes(category)}
        />
      ))}
    </div>
  )
}
