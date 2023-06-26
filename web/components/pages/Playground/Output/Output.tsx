import { CodeBlock, Alert } from '@/components/ui'
import { Buttons } from './Buttons'
import { OutputTypes } from './Output.constants'

type Props = {
  currentTab: OutputTypes
  error?: string
  data?: Record<string, unknown>
  isFetching: boolean
  onTabClick: (tab: OutputTypes) => void
}

export function Output({ data, currentTab, onTabClick, error }: Props) {
  return (
    <div className="relative">
      {error && <Alert type="error">{error}</Alert>}
      {data && currentTab === OutputTypes.Response && (
        <div className="overflow-scroll">
          <CodeBlock code={JSON.stringify(data, null, 2)} language="json" />
        </div>
      )}
    </div>
  )
}
