import React, { PropsWithChildren, ReactElement } from 'react'
import classnames from 'classnames'

export type ErrorAlertProps = PropsWithChildren<{
  className?: string
  testId?: string
}>

export function ErrorAlert({
  children,
  className,
  testId
}: ErrorAlertProps): ReactElement {
  const classes = classnames('m3o-error-alert', className)

  return (
    <div className={classes} data-testid={testId}>
      <strong>ERROR:</strong> {children}
    </div>
  )
}
