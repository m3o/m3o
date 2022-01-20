import type { PropsWithChildren } from 'react'
import classNames from 'classnames'
import { Label } from './Label'

export interface Props {
  className?: string
  error?: string
  label: string
  name: string
  required?: boolean
}

export function FormField({
  label,
  children,
  className = '',
  error = '',
  required = false,
  name
}: PropsWithChildren<Props>) {
  const cx = classNames(className, 'w-full mb-6', {
    // [s.error]: errors.length,
  })

  return (
    <div className={cx}>
      {label && (
        <Label name={name} hasErrors={!!error} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error && <p className="text-red-600 text-sm my-2">{error}</p>}
    </div>
  )
}
