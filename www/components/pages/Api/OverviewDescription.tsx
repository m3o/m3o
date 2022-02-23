import type { FC } from 'react'
import classnames from 'classnames'
import ReactMarkdown from 'react-markdown'
import styles from './styles/OverviewDescription.module.css'

export function createDescription(description = ''): string {
  const [, desc] = description.split('Service')
  return desc.replace('\n', ' ')
}

export const OverviewDescription: FC = ({ children }) => {
  return (
    <ReactMarkdown className={classnames(styles.root)}>
      {createDescription(children as string)}
    </ReactMarkdown>
  )
}
