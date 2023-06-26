import type { FC } from 'react'
import type { Languages } from '@/types'
import classnames from 'classnames'
import { CodeExampleButton } from './CodeExampleButton'

interface Props {
  handleButtonClick: (language: Languages) => void
  selectedLanguage: Languages
}

const LANGUAGES_ARRAY: Languages[] = ['bash', 'go', 'javascript']

export const LanguageButtons: FC<Props> = ({
  handleButtonClick,
  selectedLanguage,
}) => {
  return (
    <div className="mt-6 md:inline-flex md:ml-auto md:mb-4 md:mt-0">
      {LANGUAGES_ARRAY.map(language => (
        <CodeExampleButton
          key={language}
          isSelected={language === selectedLanguage}
          onClick={() => handleButtonClick(language)}
          className="md:mr-2 md:last:mr-0">
          {language}
        </CodeExampleButton>
      ))}
    </div>
  )
}
