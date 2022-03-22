import type { Func } from 'm3o/function'
import Editor, { EditorProps } from '@monaco-editor/react'
import { useForm, Controller } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useRef, useEffect, useCallback } from 'react'
import { useM3OClient } from '@/hooks'
import { FullSpinner, TextInput, Select } from '@/components/ui'
import { QueryKeys } from '@/lib/constants'

interface Props extends Func {
  onSubmit: (values: Func) => void
  submitButtonText?: string
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

export function FunctionEditAndCreate({
  source = '',
  onSubmit,
  submitButtonText = 'Create',
  name = '',
  runtime,
  region,
}: Props) {
  const m3o = useM3OClient()
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const form = useForm<Func>()

  const handleKeyboardSave = useCallback((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.code === 'KeyS') {
      event.preventDefault()
      submitButtonRef.current?.click()
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardSave)

    // Set the initial value for the code section
    form.setValue('source', source)

    return () => {
      document.removeEventListener('keydown', handleKeyboardSave)
    }
  }, [])

  const { data, isLoading } = useQuery(
    [QueryKeys.CloudFunctions, 'regions-and-runtime'],
    async () => {
      const [{ runtimes = [] }, { regions = [] }] = await Promise.all([
        m3o.function.runtimes({}),
        m3o.function.regions({}),
      ])

      return { runtimes, regions }
    },
  )

  if (isLoading || !data) {
    return <FullSpinner />
  }

  const selectedRuntime = (form.watch('runtime') || '').replace(/[0-9]/g, '')
  const language = selectedRuntime.includes('js')
    ? 'javascript'
    : selectedRuntime

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="md:flex">
        <aside className="md:w-3/12 p-6">
          <Controller
            defaultValue={name}
            control={form.control}
            name="name"
            rules={{
              required: {
                value: true,
                message: 'Please provide the name of the function',
              },
              pattern: {
                value: /^\S+$/,
                message: 'Please enter a name without spaces',
              },
            }}
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                error={fieldState.error?.message}
                label="Name"
              />
            )}
          />
          <Controller
            control={form.control}
            name="runtime"
            defaultValue={runtime || 'nodejs16'}
            rules={{ required: 'Please select a runtime' }}
            render={({ field, fieldState }) => (
              <Select
                {...field}
                label="Runtime"
                error={fieldState.error?.message}
                options={[
                  ...data.runtimes.map(item => ({ name: item, value: item })),
                ]}
              />
            )}
          />
          <Controller
            control={form.control}
            defaultValue={region || ''}
            name="region"
            rules={{ required: 'Please select a region' }}
            render={({ field, fieldState }) => (
              <Select
                {...field}
                label="Region"
                error={fieldState.error?.message}
                options={[
                  ...data.regions.map(item => ({ name: item, value: item })),
                ]}
              />
            )}
          />
        </aside>
        <div className="md:w-9/12 border-l tbc">
          <div className="p-4 flex border-b tbc">
            <button
              className="btn small ml-auto w-full md:w-auto"
              type="submit"
              ref={submitButtonRef}>
              {submitButtonText}
            </button>
          </div>
          <Editor
            options={options}
            height="90vh"
            defaultLanguage="javascript"
            language={language}
            theme="vs-dark"
            onChange={value => {
              form.setValue('source', value || '')
            }}
            onValidate={markers => {
              console.log(markers)
            }}
            value={source}
          />
        </div>
      </div>
    </form>
  )
}
