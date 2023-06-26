import type { Func } from 'm3o/function'
import { useForm, Controller } from 'react-hook-form'
import { useRef, useEffect, useCallback } from 'react'
import { useFetchFunctionRunTimes } from '@/hooks'
import {
  FullSpinner,
  BackButtonLink,
  Button,
  TextInput,
  Select,
} from '@/components/ui'
import { FunctionEditor } from './FunctionEditor'
import { returnLanguageFromRuntime } from '@/utils/admin'

interface Props extends Func {
  onSubmit: (values: Func) => void
}

export function FunctionCreateFromSource({
  source = 'exports.handler = (req, res) => {\n  res.send({ message: \'hello world!\' });\n}',
  onSubmit,
  name = 'helloworld',
  entrypoint = 'handler',
  runtime,
}: Props) {
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const form = useForm<Func>()
  const { runTimes, isLoadingRunTimes } = useFetchFunctionRunTimes()

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

  if (isLoadingRunTimes) {
    return <FullSpinner />
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="py-4 px-8 border-b tbc">
        <BackButtonLink href="/admin/functions">
          Back to functions
        </BackButtonLink>
        <div className="md:flex justify-between items-center">
          <div className="md:flex">
            <div className="border-r tbc md:pr-10 mb-4 md:mb-0">
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
            </div>
            <div className="md:px-6 mb-4 md:mb-0">
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
                    disabled={true}
                    options={[
                      ...runTimes.map(item => ({
                        name: item,
                        value: item,
                      })),
                    ]}
                  />
                )}
              />
	      <Controller
		control={form.control}
		name="entrypoint"
                defaultValue={entrypoint || 'handler'}
		render={({ field, fieldState }) => (
		  <TextInput
		    {...field}
		    type="hidden"
		  />
		)}
	      />
            </div>
          </div>
          <Button loading={false} className="w-full my-6 md:w-auto md:my-0">
            Create
          </Button>
        </div>
      </div>
      <div className="w-full">
        <FunctionEditor
          language={returnLanguageFromRuntime(form.watch('runtime'))}
          onChange={value => {
            form.setValue('source', value || '')
          }}
          value={source}
        />
      </div>
    </form>
  )
}
