import Editor, { EditorProps } from '@monaco-editor/react'

type Props = {
  onChange: (value?: string) => void
  language: string
  value: string
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

export function FunctionEditor({ language, onChange, value }: Props) {
  return (
    <Editor
      options={options}
      height="90vh"
      width="100%"
      defaultLanguage="javascript"
      language={language}
      onChange={onChange}
      onValidate={markers => {
        console.log(markers)
      }}
      value={value}
    />
  )
}
