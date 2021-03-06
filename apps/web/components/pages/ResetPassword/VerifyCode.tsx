import type { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TextInput, Button } from '@/components/ui'

interface Fields {
  token: string
  password: string
}

interface Props {
  onSubmit: (values: Fields) => void
  isLoading: boolean
}

export const VerifyCode: FC<Props> = ({ onSubmit, isLoading }) => {
  const { control, handleSubmit } = useForm<Fields>()

  return (
    <>
      <p className="mb-4 text-white">
        Please check your email (including your spam folder) to find your
        security code
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          defaultValue=""
          rules={{
            required: {
              value: true,
              message: 'Please provide the code provided in your email',
            },
          }}
          name="token"
          render={({ field: { ref, ...field } }) => (
            <TextInput {...field} label="Code" />
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="password"
          rules={{
            required: {
              value: true,
              message: 'Please provide your password',
            },
          }}
          render={({ field: { ref, ...field } }) => (
            <TextInput {...field} label="New Password" type="password" />
          )}
        />
        <Button loading={isLoading}>Submit</Button>
      </form>
    </>
  )
}
