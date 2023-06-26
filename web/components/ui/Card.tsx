import { FC } from 'react'
import classnames from 'classnames'

interface Props {
  className?: string
  id?: string
}

export const Card: FC<Props> = ({ children, className, id }) => {
  return (
    <div id={id} className={classnames('card tbc', className)}>
      {children}
    </div>
  )
}
