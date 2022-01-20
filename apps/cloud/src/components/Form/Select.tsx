import type { ComponentPropsWithRef } from 'react'
import { forwardRef } from 'react'
import { FormField, Props as FormFieldProps } from './FormField'

type Props = ComponentPropsWithRef<'select'> & FormFieldProps

export const Select = forwardRef<HTMLSelectElement, Props>(
  (
    { className, label, required, error, name, children, ...selectProps },
    ref
  ) => {
    return (
      <FormField
        label={label}
        error={error}
        required={required}
        name={name}
        className={className}
      >
        <select
          {...selectProps}
          ref={ref}
          className="p-4 border border-zinc-600 rounded-md bg-transparent w-full text-sm"
        >
          {children}
        </select>
      </FormField>
    )
  }
)
