import type { ReactElement } from 'react'

interface Props {
  onClick: VoidFunction
}

export function ShowCategoryMobileMenuButton({ onClick }: Props): ReactElement {
  return (
    <button
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 btn z-40 md:hidden flex items-center"
      onClick={onClick}
      data-testid="explore-select-filters">
      Select Category
    </button>
  )
}
