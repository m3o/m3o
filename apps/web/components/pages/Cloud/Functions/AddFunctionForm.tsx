import type { ReactElement } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { TextInput, Select } from '@/components/ui'

type Props = {
  regions: string[]
  runtimes: string[]
}

export function AddFunctionForm({ regions, runtimes }: Props): ReactElement {
  const { control } = useFormContext()

  return (
    <>
      <Controller
        control={control}
        defaultValue=""
        name="name"
        rules={{ required: 'Please provide your functions name' }}
        render={({ field, fieldState }) => (
          <TextInput
            {...field}
            label="Name"
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="repo"
        defaultValue=""
        rules={{ required: 'Please provide a repo' }}
        render={({ field, fieldState }) => (
          <TextInput
            {...field}
            label="Repo"
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="branch"
        rules={{ required: 'Please provide a branch' }}
        render={({ field, fieldState }) => (
          <TextInput
            {...field}
            label="Branch"
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="subfolder"
        render={({ field, fieldState }) => (
          <TextInput
            {...field}
            label="Subfolder (optional)"
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="entrypoint"
        render={({ field, fieldState }) => (
          <TextInput
            {...field}
            label="Entrypoint (optional)"
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="runtime"
        rules={{ required: 'Please select a runtime' }}
        render={({ field, fieldState }) => (
          <Select
            {...field}
            label="Runtime"
            error={fieldState.error?.message}
            options={[
              { name: 'Please select', value: '' },
              ...runtimes.map(item => ({ name: item, value: item })),
            ]}
          />
        )}
      />
      <Controller
        control={control}
        name="region"
        rules={{ required: 'Please select a region' }}
        render={({ field, fieldState }) => (
          <Select
            {...field}
            label="Region"
            error={fieldState.error?.message}
            options={[
              { name: 'Please select', value: '' },
              ...regions.map(item => ({ name: item, value: item })),
            ]}
          />
        )}
      />
    </>
  )
}
