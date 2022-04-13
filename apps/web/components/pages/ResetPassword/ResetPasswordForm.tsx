import type { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextInput, Button, Alert } from '@/components/ui'

export interface ResetPasswordFormFields {
  email: string
}

interface Props {
  error: string | null
  onSubmit: (values: ResetPasswordFormFields) => void
  isLoading: boolean
}

export const ResetPasswordForm: FC<Props> = ({
  error,
  onSubmit,
  isLoading,
}) => {
  const { handleSubmit, control } = useForm<ResetPasswordFormFields>({
    defaultValues: {
      email: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}
      <Controller
        control={control}
        name="email"
        render={({ field: { ref, ...field } }) => (
          <TextInput
            {...field}
            label="Email address"
            placeholder="john@doe.com"
          />
        )}
      />
      <Button type="submit" loading={isLoading}>
        Submit for security token
      </Button>
    </form>
  )
}
