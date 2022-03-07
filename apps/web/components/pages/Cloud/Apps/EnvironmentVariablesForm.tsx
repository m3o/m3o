import type { ReactElement } from 'react'
import type { RunRequest } from 'm3o/app'
import { PlusIcon, TrashIcon } from '@heroicons/react/outline'
import {
  useForm,
  Controller,
  useFieldArray,
  useFormContext,
} from 'react-hook-form'
import { TextInput, Select, BackButtonLink, Button } from '@/components/ui'
import { AddAppFormValues } from '@/types'

export function EnvironmentVariablesForm(): ReactElement {
  const { control } = useFormContext<AddAppFormValues>()

  const { fields, append, remove } = useFieldArray<
    AddAppFormValues,
    'env_vars',
    'id'
  >({
    control,
    name: 'env_vars',
  })

  return (
    <>
      <button
        type="button"
        className="btn mb-4 ml-auto self-start float-right"
        onClick={() => append({ key: '', value: '' })}>
        <PlusIcon className="w-4" />
      </button>
      <div className="clear-both">
        {fields.map((field, idx) => (
          <div
            key={field.id}
            className="grid grid-cols-7 gap-4 mb-4 items-center">
            <Controller
              control={control}
              name={`env_vars.${idx}.key`}
              rules={{
                required: { value: true, message: 'Please provide a key name' },
                pattern: {
                  value: /^[A-Z]+(?:_[A-Z]+)*$/,
                  message: 'Only uppercase and underscores permitted',
                },
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  error={fieldState.error?.message}
                  placeholder="Key e.g MY_VAR"
                  wrapperClassName="col-span-3 self-start"
                />
              )}
            />
            <Controller
              control={control}
              name={`env_vars.${idx}.value`}
              rules={{
                required: { value: true, message: 'Please provide a value' },
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  error={fieldState.error?.message}
                  placeholder="Value e.g my value"
                  wrapperClassName="col-span-3 self-start"
                />
              )}
            />
            <button
              type="button"
              className="btn mb-4 ml-auto self-start"
              onClick={() => remove(idx)}>
              <TrashIcon className="w-4" />
            </button>
          </div>
        ))}
        {fields.length === 0 && (
          <div className="p-6 tbgc mb-6 rounded-md text-center">
            <p className="mb-6">No environment variables added</p>
            <button
              type="button"
              className="btn"
              onClick={() => append({ key: '', value: '' })}>
              <PlusIcon className="w-4" />
            </button>
          </div>
        )}
      </div>
      <div className="border-t tbc">
        <Button className="mt-6 text-sm self-start">Complete</Button>
      </div>
    </>
  )
}
