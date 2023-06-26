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
                value: /^[A-Z0-9]+(?:_[A-Z0-9]+)*$/,
                message: 'Only uppercase letters, numbers and underscores permitted',
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
      <button
        type="button"
        className="btn mb-4 ml-auto self-start"
        onClick={() => append({ key: '', value: '' })}>
        <PlusIcon className="w-4" />
      </button>
    </>
  )
}
