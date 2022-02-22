import type { FC, ReactElement } from 'react'
import { useState } from 'react'
import { TabButton } from './TabButton'

interface Props {
  children: ReactElement[]
  initialTabIndex?: number
}

export const Tabs: FC<Props> = ({ children, initialTabIndex = 0 }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(initialTabIndex)

  return (
    <div>
      <ul className="tabs">
        {children.map((item, index) => (
          <li key={index}>
            <TabButton
              title={item.props.title}
              index={index}
              setSelectedTab={setSelectedTabIndex}
              selected={index === selectedTabIndex}
            />
          </li>
        ))}
      </ul>
      <div>{children[selectedTabIndex]}</div>
    </div>
  )
}
