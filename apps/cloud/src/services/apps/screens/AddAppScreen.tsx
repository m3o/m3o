import type { FC } from 'react'
import type { RunRequest } from 'm3o/app'
import { useForm, Controller } from 'react-hook-form'
import { BackButtonLink } from '../../../components/Buttons/BackButtonLink'
import { Heading1 } from '../../../components/Headings/Heading1'
import { TextInput } from '../../../components/Form/TextInput'
import { Select } from '../../../components/Form/Select'
import { useAppRegions } from '../hooks/useAppRegions'
import { SubmitButton } from '../../../components/Buttons/SubmitButton'
import { Spinner } from '../../../components/Spinner'
import { useRunApp } from '../hooks/useRunApp'

export const AddAppScreen: FC = () => {
  const { run } = useRunApp()
  const { regions, isLoading } = useAppRegions()
  const { handleSubmit, control } = useForm<RunRequest>()

  return (
    <div className="p-10">
      <BackButtonLink to="/apps">Back to apps</BackButtonLink>
      <Heading1>Add app</Heading1>
      <form
        onSubmit={handleSubmit((values: RunRequest) => run(values))}
        className="max-w-2xl pt-6"
      >
        <Controller
          control={control}
          defaultValue=""
          name="name"
          rules={{ required: 'Please provide your apps name' }}
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
          name="port"
          rules={{ required: 'Please provide a port number' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Port"
              type="number"
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
        {isLoading ? (
          <Spinner />
        ) : (
          <Controller
            control={control}
            name="region"
            rules={{ required: 'Please select a region' }}
            render={({ field, fieldState }) => (
              <Select
                {...field}
                label="Region"
                error={fieldState.error?.message}
              >
                <option value="">Please select</option>
                {regions.map((region) => (
                  <option value={region} key={region}>
                    {region}
                  </option>
                ))}
              </Select>
            )}
          />
        )}
        <SubmitButton>Submit</SubmitButton>
      </form>
    </div>
  )
}
