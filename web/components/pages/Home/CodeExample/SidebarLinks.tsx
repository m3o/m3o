import type { FC } from 'react'
import { LandingPageExampleNames } from '@/lib/constants'
import { SIDEBAR_ITEMS } from './CodeExample.constants'
import { CodeExampleButton } from './CodeExampleButton'

interface Props {
  selectedExample: LandingPageExampleNames
  handleButtonClick: (exampleName: LandingPageExampleNames) => void
}

export const SidebarLinks: FC<Props> = ({
  selectedExample,
  handleButtonClick,
}) => {
  return (
    <div className="mt-6 md:mt-0">
      {SIDEBAR_ITEMS.map(sidebarItem => (
        <div key={sidebarItem.title} className="mb-6">
          <h5 className="font-bold mb-4">{sidebarItem.title}</h5>
          {sidebarItem.items.map(({ example, text }) => (
            <CodeExampleButton
              key={text}
              onClick={() => handleButtonClick(example)}
              isSelected={selectedExample === example}>
              {text}
            </CodeExampleButton>
          ))}
        </div>
      ))}
    </div>
  )
}
