import type { FC } from 'react'
import { useCallback } from 'react'
import classnames from 'classnames'

interface Props {
  title: string
  index: number
  setSelectedTab: (index: number) => void
  selected: boolean
}

export const TabButton: FC<Props> = ({
  index,
  title,
  selected,
  setSelectedTab,
}) => {
  const onClick = useCallback(() => {
    setSelectedTab(index)
  }, [setSelectedTab, index])

  return (
    <button onClick={onClick} className={classnames('tab', { selected })}>
      {title}
    </button>
  )
}
