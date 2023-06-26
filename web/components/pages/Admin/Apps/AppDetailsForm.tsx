import type { RunRequest } from 'm3o/app'
import type { ReactElement } from 'react-markdown'
import { Controller, useFormContext } from 'react-hook-form'
import { TextInput, Select } from '@/components/ui'

interface Props {
  regions: string[]
}

export function AppDetailsForm({ regions }: Props): ReactElement {
  const { control } = useFormContext<RunRequest>()

  return (
    <>
      <Controller
        control={control}
        defaultValue=""
        name="name"
        rules={{
          required: {
            value: true,
            message: 'Please provide your apps name',
          },
          pattern: {
            value: /^\S+$/,
            message: 'Please enter a name without spaces',
          },
        }}
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
            placeholder="main"
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="port"
        rules={{ required: 'Please provide a port number' }}
        render={({ field, fieldState }) => (
          <TextInput
            {...field}
            label="Port"
            type="number"
            placeholder="8080"
            error={fieldState.error?.message}
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
            options={regions.map(region => ({
              name: region,
              value: region,
            }))}
          />
        )}
      />
    </>
  )
}
