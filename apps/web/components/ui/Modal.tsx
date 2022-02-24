import type { FC } from 'react'
import { useEffect } from 'react'
import classnames from 'classnames'
import XIcon from '@heroicons/react/outline/XIcon'

export interface ModalProps {
  closeModal: VoidFunction
  open: boolean
}

export const Modal: FC<ModalProps> = ({ closeModal, open, children }) => {
  const classes = classnames('fixed z-50 inset-0 overflow-y-auto flex', {
    flex: open,
    hidden: !open,
  })

  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }

    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [open])

  return (
    <div
      className={classes}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true">
      <div
        className="fixed inset-0 bg-zinc-900 bg-opacity-90 transition-opacity"
        aria-hidden="true"
        onClick={closeModal}
      />
      <div className=" bg-white rounded-lg text-left shadow-xl transform transition-all sm:max-w-lg sm:w-full m-auto p-8 relative dark:bg-zinc-800 ">
        <button onClick={closeModal} className="w-6 absolute right-8 top-8">
          <XIcon />
        </button>
        {children}
      </div>
    </div>
  )
}
