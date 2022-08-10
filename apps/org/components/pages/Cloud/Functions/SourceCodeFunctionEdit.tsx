import type { Func } from 'm3o/function'
import type { ReactElement } from 'react'
import { useRef } from 'react'
import { Tabs } from '@/components/ui'
import { FunctionHeader } from './FunctionHeader'
import { FunctionEditor } from './FunctionEditor'
import { FunctionLogs } from './Logs'
import { returnLanguageFromRuntime } from '@/utils/cloud'

export type SourceCodeFunctionEditProps = {
  func: Func
  onUpdateClick: (props: { name: string; source: string }) => void
  isUpdating: boolean
}

export function SourceCodeFunctionEdit({
  func,
  onUpdateClick,
  isUpdating,
}: SourceCodeFunctionEditProps): ReactElement {
  const sourceCodeRef = useRef(func.source || '')

  return (
    <>
      <FunctionHeader
        func={func}
        onSubmit={() =>
          onUpdateClick({
            name: func.name as string,
            source: sourceCodeRef.current,
          })
        }
        isLoading={isUpdating}
      />
      <Tabs>
        <div title="Source code">
          <div className="px-6">
            <FunctionEditor
              onChange={value => {
                sourceCodeRef.current = value || ''
              }}
              value={sourceCodeRef.current}
              language={returnLanguageFromRuntime(func.runtime)}
            />
          </div>
        </div>
        <div title="Logs">
          <FunctionLogs />
        </div>
      </Tabs>
    </>
  )
}
