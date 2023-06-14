import { type ComponentProps, forwardRef } from 'react'

export const Input = forwardRef<
    HTMLInputElement,
    ComponentProps<'input'> & { label: string }
>(function InputComponent({ label, ...props }, ref) {
    return (
        <div>
            <label className="block text-sm mb-1">{label}</label>
            <input
                {...props}
                ref={ref}
                className="border border-zinc-300 p-2 rounded-sm"
            />
        </div>
    )
})
