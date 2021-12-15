import React, { PropsWithChildren, ReactElement } from 'react'
import classnames from 'classnames'
// import styles from './Card.module.css'

type CardProps = PropsWithChildren<{
  className?: string
  title: string
}>

export function Card({ children, className, title }: CardProps): ReactElement {
  const classes = classnames(className, 'm3o-card')

  return (
    <div className={classes}>
      <h1 className="m3o-card-title">{title}</h1>
      {children}
    </div>
  )
}
