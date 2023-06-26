import type { FC } from 'react'
import classnames from 'classnames'
import { CloseButton } from '@/components/ui'

interface Props {
  isOpen: boolean
  onClose: VoidFunction
}

export const MobileFilters: FC<Props> = ({ children, isOpen, onClose }) => {
  const classes = classnames(
    'fixed transform top-0 bg-white z-50 w-full bottom-0 overflow-y-scroll md:hidden transition-transform p-6 dark:bg-zinc-900',
    {
      'pointer-events-none translate-y-full': !isOpen,
    },
  )
  return (
    <div className={classes} data-testid="explore-mobile-filters">
      <div className="text-right">
        <CloseButton onClose={onClose} />
      </div>
      {children}
    </div>
  )
}
