import React, { PropsWithChildren, ReactElement } from 'react'
import classNames from 'classnames'

type LabelProps = PropsWithChildren<{
  hasErrors?: boolean
  name: string
  required?: boolean
}>

export function Label({
  children,
  required = false,
  hasErrors = false,
  name
}: LabelProps): ReactElement {
  const cx = classNames('block text-sm font-medium mb-2', {
    'text-red-600': hasErrors
  })

  return (
    <label htmlFor={name} className={cx}>
      {children}
      {required && <sup className="text-red-600">*</sup>}
    </label>
  )
}
