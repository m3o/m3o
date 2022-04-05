import { CodeBlock } from '@/components/ui'
import { Buttons } from './Buttons'
import { OutputTypes } from './Output.constants'

type Props = {
  currentTab: OutputTypes
  data?: Record<string, unknown>
  isFetching: boolean
  onTabClick: (tab: OutputTypes) => void
}

export function Output({ data, currentTab, onTabClick }: Props) {
  return (
    <div className="w-full">
      <div className="border-b border-zinc-800">
        <Buttons currentTab={currentTab} onButtonClick={onTabClick} />
      </div>
      {data && currentTab === OutputTypes.Response && (
        <div className="w-full h-full">
          <CodeBlock code={JSON.stringify(data, null, 2)} language="json" />
        </div>
      )}
    </div>
  )
}
