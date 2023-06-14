import type { ComponentProps } from 'react'
import { Loader } from './loader'

export function Button({
    children,
    className,
    showLoader = false,
    ...props
}: ComponentProps<'button'> & {
    showLoader?: boolean
}) {
    return (
        <button
            {...props}
            className={[
                className,
                'bg-black text-white p-4 text-sm rounded-md flex items-center justify-center',
            ].join(' ')}
        >
            {showLoader ? <Loader /> : children}
        </button>
    )
}
