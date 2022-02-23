import type { FC } from 'react'
import classnames from 'classnames'

export interface FormFieldProps {
  className?: string
  error?: string
  label: string
  labelClass?: string
  name: string
  required?: boolean
}

export const FormField: FC<FormFieldProps> = ({
  children,
  className,
  error,
  label,
  labelClass,
  name,
  required,
}) => {
  return (
    <div className={classnames('pb-4 relative', className)}>
      <label
        htmlFor={name}
        className={classnames('block mb-2 text-sm', labelClass)}>
        {label} {required && <sup className="text-red-500">*</sup>}
      </label>
      {children}
      {error && <p className="absolute text-red-700 text-sm mt-1">{error}</p>}
    </div>
  )
}
