import type { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextInput, Button } from '@/components/ui'

export interface ResetPasswordFormFields {
  email: string
}

interface Props {
  onSubmit: (values: ResetPasswordFormFields) => void
  isLoading: boolean
}

export const ResetPasswordForm: FC<Props> = ({ onSubmit, isLoading }) => {
  const { handleSubmit, control } = useForm<ResetPasswordFormFields>({
    defaultValues: {
      email: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
