import type { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextInput } from '../../../components/Form/TextInput'

interface ProfileField {
  key: string
  value: string
}

export const AddProfileField: FC = () => {
  const { handleSubmit, control } = useForm<ProfileField>()

  return (
    <div className="w-96">
      <h3 className="font-bold text-2xl mb-6">Add extra field</h3>
      <Controller
        name="key"
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            label="Key"
            placeholder="e.g firstName"
            className="mb-6"
          />
        )}
      />
      <Controller
        name="value"
        control={control}
        render={({ field }) => (
          <TextInput {...field} label="Value" placeholder="e.g firstName" />
        )}
      />
    </div>
  )
}
