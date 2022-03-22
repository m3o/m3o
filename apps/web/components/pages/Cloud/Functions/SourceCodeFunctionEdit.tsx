import type { Func } from 'm3o/function'
import type { ReactElement } from 'react'
import { useRef } from 'react'
import Editor, { EditorProps } from '@monaco-editor/react'
import { Tabs } from '@/components/ui'
import { FunctionHeader } from './FunctionHeader'
import { FunctionLogs } from './Logs'

export type SourceCodeFunctionEditProps = {
  func: Func
  onUpdateClick: (props: { name: string; source: string }) => void
  isUpdating: boolean
}

const options: EditorProps['options'] = {
  automaticLayout: true,
  contextmenu: false,
  folding: false,
  glyphMargin: false,
  lineNumbers: 'on',
  lineDecorationsWidth: 40,
  lineNumbersMinChars: 0,
  renderLineHighlight: 'none',
  minimap: {
    enabled: false,
  },
  scrollbar: {
    vertical: 'hidden',
    horizontal: 'hidden',
  },
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
        onUpdateClick={() =>
          onUpdateClick({
            name: func.name as string,
            source: sourceCodeRef.current,
          })
        }
        isUpdating={isUpdating}
      />
      <Tabs>
        <div title="Source code">
          <div className="px-6">
            <Editor
              options={options}
              height="90vh"
              defaultLanguage="javascript"
              language="javascript"
              theme="vs-dark"
              onChange={value => {
                sourceCodeRef.current = value || ''
              }}
              // onValidate={markers => {
              //   console.log(markers)
              // }}
              value={sourceCodeRef.current}
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
