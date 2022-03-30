import { FC } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { nord } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface Props {
  code: string
  language?: 'javascript' | 'json' | 'bash' | 'go' | 'cli'
}

export const CodeBlock: FC<Props> = ({ code, language = 'javascript' }) => {
  return (
    <SyntaxHighlighter
      language={language}
      showLineNumbers={false}
      style={nord}
      wrapLines={true}
      lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
      customStyle={{
        fontSize: 14,
        marginTop: 0,
        paddingLeft: 30,
        background: 'transparent',
      }}>
      {code}
    </SyntaxHighlighter>
  )
}
