import { XCircleIcon } from '@heroicons/react/24/solid'
import { PropsWithChildren } from 'react'

export function SelectedCommand({
    children,
    onCancelClick,
}: PropsWithChildren<{
    onCancelClick: VoidFunction
}>) {
    return (
        <p className="m-1 bg-green-200 text-green-800 py-1 px-3 rounded-md flex items-center gap-1">
            {children}
            <button onClick={onCancelClick} type="button">
                <XCircleIcon className="w-4" />
            </button>
        </p>
    )
}
