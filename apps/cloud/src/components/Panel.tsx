import type { FC } from 'react'
import classnames from 'classnames'

interface Props {
  open: boolean
  onCloseClick: VoidFunction
}

export const Panel: FC<Props> = ({ children, open, onCloseClick }) => {
  const bgClasses = classnames(
    'fixed inset-0 bg-black bg-opacity-75 z-10 transition-opacity cursor-pointer',
    {
      'opacity-0 pointer-events-none': !open
    }
  )

  const panelClasses = classnames(
    'fixed right-0 top-0 bottom-0 bg-gray-900 z-20 p-6 transition-transform max-w-xl text-white overflow-y-scroll',
    {
      'translate-x-full': !open
    }
  )

  return (
    <div>
      <div className={bgClasses} onClick={onCloseClick} />
      <div className={panelClasses}>{children}</div>
    </div>
  )
}
