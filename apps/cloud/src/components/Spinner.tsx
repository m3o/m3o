import type { FC } from 'react'
import classnames from 'classnames'
import '../styles/Spinner.css'

interface Props {
  className?: string
  variant?: 'indigo'
}

export const Spinner: FC<Props> = ({ variant, className }) => {
  const classes = classnames('loader', variant)
  const wrapperClasses = classnames(className)

  return (
    <div className={wrapperClasses}>
      <div className={classes}>Loading...</div>
    </div>
  )
}
