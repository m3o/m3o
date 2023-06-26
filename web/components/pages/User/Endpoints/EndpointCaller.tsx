import type { FC } from 'react'
import Editor, { EditorProps } from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { FormattedEndpointExample } from '@/types'
import { stringifyAndFormatJSON } from '@/utils/text'

interface Props {
  endpoint: FormattedEndpointExample
  onRunClick: VoidFunction
  response?: unknown
  handleRequestChange: (value?: string) => void
}

const options: EditorProps['options'] = {
  automaticLayout: true,
  contextmenu: false,
  folding: false,
  glyphMargin: false,
  language: 'json',
  lineNumbers: 'off',
  lineDecorationsWidth: 0,
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

export const EndpointCaller: FC<Props> = ({
  endpoint,
  onRunClick,
  response,
  handleRequestChange,
}) => {
  const { theme } = useTheme()

  return (
    <div className="w-full">
      <div className="md:grid md:grid-rows-2 endpoint-caller">
        <div>
          <div className="flex justify-between items-center p-4 border-zinc-300 border-solid border-b h-14 text-sm">
            Request
            <button
              className="py-1 px-2 bg-indigo-700 text-white text-sm rounded-md"
              onClick={onRunClick}
              data-testid="console-run">
              Run
            </button>
          </div>
          <div className="p-2">
            <Editor
              value={stringifyAndFormatJSON(endpoint.request)}
              language="json"
              height="250px"
              onChange={handleRequestChange}
              options={options}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
            />
          </div>
        </div>
        <div>
          <div className="p-4 border-zinc-300 border-solid border-b border-t md:border-t-0 h-14 text-sm flex items-center">
            Response
          </div>
          {response && (
            <div className="p-2">
              <Editor
                value={stringifyAndFormatJSON(response)}
                language="json"
                height="250px"
                options={options}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
