import type { ComponentPropsWithoutRef, FC } from 'react'
import { forwardRef } from 'react'
import classnames from 'classnames'
import { FormField, FormFieldProps } from './FormField'

type Props = FormFieldProps &
  ComponentPropsWithoutRef<'input'> & {
    wrapperClassName?: string
    variant?: 'default' | 'grey'
  }

export const TextInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      name,
      error,
      label,
      labelClass,
      required,
      wrapperClassName,
      variant = 'default',
      ...props
    },
    ref,
  ) => {
    const classes = classnames('input', className, {
      'text-zinc-600': 'text-zinc-600',
      'border-zinc-300': !error,
      'border-red-700': error,
      grey: variant === 'grey',
    })

    return (
      <FormField
        name={name}
        label={label}
        error={error}
        className={wrapperClassName}
        labelClass={labelClass}>
        <input
          ref={ref}
          type="text"
          name={name}
          className={classes}
          autoComplete="email"
          {...props}
        />
      </FormField>
    )
  },
)
