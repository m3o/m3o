import type { FC } from 'react'
import type { VerifySignUpPayload } from '@/types'
import { useForm, Controller } from 'react-hook-form'
import { TextInput, Button } from '@/components/ui'

export type VerifySignUpFormFields = Omit<VerifySignUpPayload, 'email'>

interface Props {
  isLoading: boolean
  onSubmit: (fields: VerifySignUpFormFields) => void
}

export const VerifySignUpForm: FC<Props> = ({ onSubmit, isLoading }) => {
  const { control, handleSubmit } = useForm<VerifySignUpFormFields>()

  return (
    <div data-testid="verify-signup-form">
      <p className="mb-4">
        Please check your email (including your spam folder) to find your
        verification code
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="token"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextInput {...field} label="Code" />
          )}
        />
        <Controller
          name="secret"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextInput {...field} label="Password" type="password" />
          )}
        />
        <Button
          className="w-full mt-6 justify-center"
          loading={isLoading}
          inverse={true}
          data-testid="verify-register-button">
          Register
        </Button>
      </form>
    </div>
  )
}
