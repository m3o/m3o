import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-nord_dark'

type Props = {
  onChange: (value: string) => void
  value: string
}

export default function Editor({ onChange, value }: Props) {
  return (
    <AceEditor
      mode="json"
      theme="nord_dark"
      onChange={onChange}
      name="UNIQUE_ID_OF_DIV"
      value={value}
      editorProps={{ $blockScrolling: true }}
    />
  )
}
