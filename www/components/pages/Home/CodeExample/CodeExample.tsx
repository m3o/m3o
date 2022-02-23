import { CopyBlock, nord } from 'react-code-blocks'
import type { FC } from 'react'
import { Spinner } from '@/components/ui'
import { useState } from 'react'
import { useSelectLanguage, useFetchExample } from '@/hooks'
import { LandingPageExampleNames } from '@/lib/constants'
import { LanguageButtons } from './LanguageButtons'
import { SidebarLinks } from './SidebarLinks'
import styles from './CodeExample.module.css'
import { Step } from './Step'

export const CodeExample: FC = () => {
  const { language, onLanguageChange } = useSelectLanguage('javascript')
  const [selectedExample, setSelectedExample] = useState(
    LandingPageExampleNames.DbCreate,
  )

  const { data = '', isLoading } = useFetchExample({
    language,
    selectedExample,
  })

  return (
    <div className="mt-16 bg-zinc-900 rounded-lg text-left text-white p-6">
      <Step step={1}>Select a language</Step>
      <div className="md:flex">
        <LanguageButtons
          handleButtonClick={onLanguageChange}
          selectedLanguage={language}
        />
      </div>
      <div className="md:grid md:grid-cols-4">
        <aside className="pt-6 md:pt-0 md:pr-6">
          <Step step={2}>Select an example</Step>
          <SidebarLinks
            selectedExample={selectedExample}
            handleButtonClick={setSelectedExample}
          />
        </aside>
        <div className="col-span-3">
          <Step step={3} className="mb-6">
            See the code!
          </Step>
          <div className={styles.copyBlock}>
            {isLoading ? (
              <div className="flex items-center justify-center pt-20">
                <Spinner />
              </div>
            ) : (
              <CopyBlock
                text={data.trim()}
                language={language}
                showLineNumbers={false}
                theme={nord}
                customStyle={{
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  overflowY: 'scroll',
                  fontSize: '0.85rem',
                  padding: 30,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
