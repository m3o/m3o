import type { Languages } from '@/types'
import { useQuery } from 'react-query'
import axios from 'axios'
import { removeFullStopAtEnd, camelize } from '@/utils/helpers'

interface FetchCodeExample {
  apiName: string
  enabled: boolean
  examplePath: string
  language: Languages
  path: string
}

type Extensions = Record<Languages, string>

const URL = 'https://raw.githubusercontent.com/m3o'

const EXTENSIONS: Extensions = {
  cli: '.sh',
  bash: '.sh',
  dart: '.dart',
  go: '.go',
  javascript: '.js',
}

async function fetchCodeExample({
  apiName,
  language,
  examplePath,
  path,
}: FetchCodeExample) {
  const extension = EXTENSIONS[language]
  const repo = language == 'cli' ? 'm3o-cli' : `m3o-${extension.replace('.', '')}`
  const branch = 'main'
  const method = removeFullStopAtEnd(examplePath)
  const mainExtension = extension.includes('go') || extension.includes('dart') ? '/main' : ''
  const examples = language == 'dart' ? 'example' : 'examples'

  const response = await axios.get(
    `${URL}/${repo}/${branch}/${examples}/${apiName}/${camelize(
      path,
    )}/${method}${mainExtension}${extension}`,
    {
      responseType: 'text',
    },
  )

  return response.data
}

export function useFetchRequestExample(props: FetchCodeExample) {
  return useQuery(
    ['request-example', props.path, props.language],
    () => fetchCodeExample(props),
    {
      enabled: props.enabled,
      retry: false,
      refetchOnWindowFocus: false,
    },
  )
}
