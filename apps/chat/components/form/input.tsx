import { type ComponentProps, forwardRef } from 'react'

export const Input = forwardRef<
    HTMLInputElement,
    ComponentProps<'input'> & { label?: string; error?: string }
>(function InputComponent({ label = '', error, ...props }, ref) {
    return (
        <div className="w-full mb-6 last:mb-0">
            {label && <label className="block text-xs mb-2">{label}</label>}
            <input
                {...props}
                ref={ref}
                className="border border-zinc-300 p-3 rounded-sm w-full placeholder:text-sm"
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    )
})
