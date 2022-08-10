import type { FC } from 'react'
import classnames from 'classnames'

interface Props {
  className?: string
  step: number
}

export const Step: FC<Props> = ({ step, children, className }) => {
  const classes = classnames(className, 'md:hidden')

  return (
    <h6 className={classes}>
      <span className="w-6 h-6 mr-2 bg-gradient-to-r from-indigo-800 via-purple-500 to-pink-500 text-center rounded-full inline-flex items-center justify-center text-black text-sm">
        {step}
      </span>{' '}
      {children}
    </h6>
  )
}
