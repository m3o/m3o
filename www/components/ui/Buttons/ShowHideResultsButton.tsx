import type { FC } from 'react'
import EyeIcon from '@heroicons/react/outline/EyeIcon'
import EyeOffIcon from '@heroicons/react/outline/EyeOffIcon'

interface Props {
  onClick: VoidFunction
  shouldShowMore: boolean
}

export const ShowHideResultsButton: FC<Props> = ({
  onClick,
  shouldShowMore,
}) => {
  const Icon = shouldShowMore ? EyeOffIcon : EyeIcon

  return (
    <button className="inverse-btn mx-auto my-10 p-4" onClick={onClick}>
      <Icon className="w-4 mr-4" /> {shouldShowMore ? 'Hide' : 'Show more'}
      {` `}
      results
    </button>
  )
}
