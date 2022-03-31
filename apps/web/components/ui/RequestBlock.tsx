import type { SchemaObject } from 'openapi3-ts'
import type { FC } from 'react'
import type { Languages, ServiceExamples } from '@/types'
import { useCallback, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import classnames from 'classnames'
import { useClickOutside, useFetchRequestExample } from '@/hooks'
import { CodeBlock } from './CodeBlock'
import { camelize } from '@/utils/helpers'
import { Spinner } from './Spinner'
import styles from './styles/RequestBlock.module.css'

type LanguagesObject = Record<Languages, string>

interface Props {
  apiName: string
  examples: ServiceExamples
  requestSchema: SchemaObject
  language: Languages
  onLanguageChange: (language: Languages) => void
  title?: string
  token?: string
}

interface CompileCode {
  code?: string
  token?: string
  language: Languages
}

const LANGUAGES: LanguagesObject = {
  dart: 'dart',
  javascript: 'js',
  go: 'go',
  cli: 'cli',
  bash: 'curl',
}

const STRING_KEY_LANGUAGES: Languages[] = ['javascript', 'go']

function returnDropdownButtonClass(selected: boolean) {
  return classnames(
    'w-full text-sm font-medium text-left p-2 hover:bg-zinc-100 rounded-md dark:hover:bg-zinc-700',
    {
      'bg-zinc-600 text-white hover:bg-zinc-700': selected,
    },
  )
}

function compileCode({ code = '', token = '', language }: CompileCode): string {
  if (!token) return code

  return code.replace(
    /process.env.M3O_API_TOKEN|os\.Getenv\(\"M3O_API_TOKEN\"\)|\$M3O_API_TOKEN/,
    STRING_KEY_LANGUAGES.includes(language) ? `"${token}"` : token,
  )
}

const returnExampleIsAvailable = (
  examples: Props['examples'],
  path: string,
): ApiMethodExample[] | undefined => examples[camelize(path)]

export const RequestBlock: FC<Props> = ({
  apiName,
  examples,
  language,
  onLanguageChange,
  requestSchema,
  title = 'Request',
  token,
}) => {
  const path = requestSchema.title!.replace('Request', '')
  const exampleAvailable = !!returnExampleIsAvailable(examples, path)

  const fetchRequestBlock = useFetchRequestExample({
    enabled: !!exampleAvailable,
    apiName,
    language,
    path,
    examplePath: exampleAvailable
      ? camelize(
          examples[camelize(path)][0].title
            .replace(',', '')
            .replace("'", '')
            .toLowerCase(),
        )
      : '',
  })

  const [showDropdown, setShowDropdown] = useState(false)

  const clickOutsideElementRef = useClickOutside({
    trigger: showDropdown,
    onClickOutside: () => {
      setShowDropdown(false)
    },
  })

  const onLanguageSelect = useCallback(
    (language: Languages) => {
      onLanguageChange(language)
      setShowDropdown(false)
    },
    [onLanguageChange],
  )

  return (
    <div className="bg-zinc-800 rounded-lg">
      <div className="p-4 border-b border-solid border-zinc-700 flex justify-between items-center">
        <p className="text-white text-sm font-medium mb-0">{title}</p>
        <div className="relative">
          <button
            className="text-sm flex items-center text-white"
            onClick={() => setShowDropdown(prev => !prev)}>
            {LANGUAGES[language]}
            <ChevronDownIcon className="w-4 ml-1" />
          </button>
          {showDropdown && (
            <div
              className="absolute right-0 z-20 bg-white p-2 rounded-md w-40 mt-2 shadow-md dark:bg-zinc-900"
              ref={clickOutsideElementRef}>
              {Object.keys(LANGUAGES).map(key => (
                <button
                  key={key}
                  className={returnDropdownButtonClass(key === language)}
                  onClick={() => onLanguageSelect(key as Languages)}>
                  {LANGUAGES[key as Languages]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {fetchRequestBlock.isFetching ? (
        <div
          className={`flex items-center mt-8 justify-center ${styles.content}`}>
          <Spinner />
        </div>
      ) : (
        <CodeBlock
          code={compileCode({
            code: fetchRequestBlock.data,
            token,
            language,
          }).trim()}
          language={language}
        />
      )}
    </div>
  )
}
