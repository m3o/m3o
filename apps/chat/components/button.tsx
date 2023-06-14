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
        <button {...props} className={[className, 'btn'].join(' ')}>
            {showLoader ? <Loader /> : children}
        </button>
    )
}
