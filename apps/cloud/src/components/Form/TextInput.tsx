import type { ComponentPropsWithRef } from 'react'
import { forwardRef } from 'react'
import { FormField, Props as FormFieldProps } from './FormField'

type Props = ComponentPropsWithRef<'input'> & FormFieldProps

export const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ className, label, required, error, name, ...inputProps }, ref) => {
    return (
      <FormField
        label={label}
        error={error}
        required={required}
        name={name}
        className={className}
      >
        <input
          {...inputProps}
          ref={ref}
          name={name}
          className="p-4 border border-zinc-600 rounded-md bg-transparent w-full text-sm"
        />
      </FormField>
    )
  }
)
