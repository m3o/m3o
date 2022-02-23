import type { ComponentPropsWithoutRef, FC } from 'react'
import classnames from 'classnames'
import { FormField, FormFieldProps } from './FormField'

type Props = FormFieldProps & ComponentPropsWithoutRef<'input'>

export const TextInput: FC<Props> = ({
  className,
  name,
  error,
  label,
  labelClass,
  required,
  ...props
}) => {
  const classes = classnames('input', className, {
    'border-zinc-300': !error,
    'border-red-700': error,
  })

  return (
    <FormField name={name} label={label} error={error} labelClass={labelClass}>
      <input
        type="text"
        name={name}
        className={classes}
        autoComplete="email"
        {...props}
      />
    </FormField>
  )
}
