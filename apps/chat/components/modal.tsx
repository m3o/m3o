import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { type PropsWithChildren, useEffect } from 'react'
import { createPortal } from 'react-dom'

export type ModalProps = { open: boolean; onClose: VoidFunction }

export function Modal({
    children,
    open,
    onClose,
}: PropsWithChildren<ModalProps>) {
    useEffect(() => {
        if (!open) return

        document.body.classList.add('overflow-hidden')

        return () => {
            document.body.classList.remove('overflow-hidden')
        }
    }, [open])

    return createPortal(
        <div
            className={clsx(
                'fixed z-50 inset-0 md:flex md:justify-center md:items-center',
                {
                    '!hidden': !open,
                }
            )}
        >
            <span
                className="bg-black bg-opacity-90 fixed inset-0"
                onClick={onClose}
            />
            <div className="bg-white relative z-20 p-8 w-full md:max-w-md mx-auto rounded-md">
                <button
                    className="hover:bg-teal-500 p-2 rounded-md absolute right-6 top-6 transition bg-zinc-100"
                    onClick={onClose}
                >
                    <XMarkIcon className="w-5" />
                </button>
                {children}
            </div>
        </div>,
        document.body
    )
}
