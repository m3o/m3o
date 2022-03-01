import type { FC } from 'react'
import type { DeployRequest } from 'm3o/function'
import { useForm, Controller } from 'react-hook-form'
import { BackButtonLink } from '../../../components/Buttons/BackButtonLink'
import { Heading1 } from '../../../components/Headings/Heading1'
import { TextInput } from '../../../components/Form/TextInput'
import { Select } from '../../../components/Form/Select'
import { useFunctionRegions } from '../hooks/useFunctionRegions'
import { useFunctionRuntimes } from '../hooks/useFunctionRuntimes'
import { SubmitButton } from '../../../components/Buttons/SubmitButton'
import { Spinner } from '../../../components/Spinner'
import { useDeployFunction } from '../hooks/useDeployFunction'

export const AddFunctionScreen: FC = () => {
  const { run } = useDeployFunction()
  const { regions, isLoading } = useFunctionRegions()
  const { runtimes, loadingRuntimes } = useFunctionRuntimes()
  const { handleSubmit, control } = useForm<DeployRequest>()

  return (
    <div className="p-10">
      <BackButtonLink to="/functions">Back to functions</BackButtonLink>
      <Heading1>Add function</Heading1>
      <form
        onSubmit={handleSubmit((values: DeployRequest) => run(values))}
        className="max-w-2xl pt-6"
      >
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
        {loadingRuntimes ? (
          <Spinner />
        ) : (
          <Controller
            control={control}
            name="runtime"
            rules={{ required: 'Please select a runtime' }}
            render={({ field, fieldState }) => (
              <Select
                {...field}
                label="Runtime"
                error={fieldState.error?.message}
              >
                <option value="">Please select</option>
                {runtimes.map((runtime) => (
                  <option value={runtime} key={runtime}>
                    {runtime}
                  </option>
                ))}
              </Select>
            )}
          />
        )}
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
