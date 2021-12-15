import React, { ComponentPropsWithRef, forwardRef } from 'react'
import classnames from 'classnames'

export type FormInputProps = ComponentPropsWithRef<'input'> & {
  className?: string
  error?: string
  errorTestId?: string
  label: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, error = '', label, name, errorTestId, ...props }, ref) => {
    const classes = classnames('m3o-form-input', className, {
      hasError: !!error
    })

    return (
      <div className={classes}>
        <label htmlFor={name}>{label}</label>
        <input name={name} {...props} ref={ref} />
        {error && (
          <p className="m3o-form-input-error" data-testid={errorTestId}>
            {error}
          </p>
        )}
      </div>
    )
  }
)
