import { FC } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { nord } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface Props {
  code: string
  language?: 'javascript' | 'json' | 'bash' | 'go'
}

export const CodeBlock: FC<Props> = ({ code, language = 'javascript' }) => {
  return (
    <SyntaxHighlighter
      language={language}
      showLineNumbers={true}
      style={nord}
      customStyle={{
        fontSize: 14,
        backgroundColor: 'rgb(31, 41, 55)',
        marginTop: 0,
      }}>
      {code}
    </SyntaxHighlighter>
  )
}
