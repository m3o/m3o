import type { Func } from 'm3o/function'
import { useRef } from 'react'
import { Button, BackButtonLink } from '@/components/ui'
import { Status, AppStatus } from '../Apps'
import { returnLanguageFromRuntime } from '@/utils/cloud'

import { FunctionEditor } from './FunctionEditor'

export interface FunctionEditSourceProps extends Func {
  func: Func
  onSubmit: (sourceCode: string) => void
  submitButtonText?: string
  isUpdating: boolean
}

export function FunctionEditSource({
  onSubmit,
  func,
  isUpdating,
}: FunctionEditSourceProps) {
  const sourceCodeRef = useRef('')

  return (
    <>
      <div className="p-8 border-b tbc">
        <BackButtonLink href="/cloud/functions">
          Back to functions
        </BackButtonLink>
        <div className="md:flex justify-between items-center">
          <div className="md:flex">
            <div className="border-r tbc md:pr-10 mb-4 md:mb-0">
              <p className="text-zinc-400 text-sm">Name:</p>
              <h2 className="font-bold xl:text-lg ml-0">{func.name}</h2>
            </div>
            <div className="md:border-r tbc md:px-6 mb-4 md:mb-0">
              <p className="text-zinc-400 text-sm">Runtime:</p>
              <h2 className="font-bold xl:text-lg">{func.runtime}</h2>
            </div>

            <div className="md:px-6">
              <p className="text-zinc-400 text-sm">Status:</p>
              <Status
                status={func.status as AppStatus}
                className="xl:text-lg font-bold text-white"
              />
            </div>
          </div>
          <Button
            onClick={() => onSubmit(sourceCodeRef.current)}
            loading={isUpdating}
            className="w-full my-6 md:w-auto md:my-0">
            Update
          </Button>
        </div>
        <a
          href={func.url}
          className="inline-block mt-2 text-sm"
          target="_blank"
          rel="noreferrer">
          {func.url}
        </a>
      </div>
      <div className="w-full p-6">
        <FunctionEditor
          language={returnLanguageFromRuntime(func.runtime)}
          onChange={value => {
            sourceCodeRef.current = value || ''
          }}
          value={func.source || ''}
        />
      </div>
    </>
  )
}
