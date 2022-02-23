import { FC } from 'react'
import classnames from 'classnames'
import styles from './styles/Spinner.module.css'

interface SpinnerProps {
  className?: string
}

export const Spinner: FC<SpinnerProps> = ({ className }) => {
  const classes = classnames(styles.root, className)

  return (
    <div className={classes}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
