import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import classnames from 'classnames'
import ReactMarkdown from 'react-markdown'
import styles from './styles/OverviewDescription.module.css'

const CHAR_COUNT = 600

export function createDescription(description = ''): string {
  const [, desc] = description.split('Service')
  return desc.replace('\n', ' ')
}

export function returnText(isExpanded: boolean, text: string): string {
  if (isExpanded || text.length < CHAR_COUNT) return text
  return `${text.slice(0, CHAR_COUNT)}...`
}

export function OverviewDescription({ children }: PropsWithChildren<{}>) {
  const text = children as string
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <ReactMarkdown className={classnames(styles.root)}>
        {createDescription(returnText(isExpanded, text))}
      </ReactMarkdown>
      {text.length >= CHAR_COUNT && (
        <button
          onClick={() => setIsExpanded(prev => !prev)}
          className="mt-3 btn">
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </>
  )
}
