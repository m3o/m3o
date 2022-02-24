import type { FC } from 'react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { Button, TextInput, OAuthSignInButtons } from '@/components/ui'
import { Routes } from '@/lib/constants'

export interface SignUpFormFields {
  email: string
}

interface Props {
  isLoading: boolean
  onSubmit: (values: SignUpFormFields) => void
}

const EMAIL_ERROR_MESSAGE = 'Please provide a valid email'

export const SignUpForm: FC<Props> = ({ onSubmit, isLoading }) => {
  const { handleSubmit, control } = useForm<SignUpFormFields>()

  return (
    <>
      <OAuthSignInButtons footerText="or sign up with your email" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="email"
          defaultValue=""
          rules={{
            required: {
              value: true,
              message: EMAIL_ERROR_MESSAGE,
            },
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: EMAIL_ERROR_MESSAGE,
            },
          }}
          render={({ field: { ref, ...field }, fieldState }) => (
            <TextInput
              {...field}
              error={fieldState?.error?.message}
              label="Email"
              placeholder="e.g jon@smith.com"
            />
          )}
        />
        <Button
          type="submit"
          className="w-full mt-4 text-center"
          loading={isLoading}>
          Register
        </Button>
        <p className="text-center mt-6 ">
          <Link href={Routes.Login}>
            <a className="underline text-indigo-600">Log in</a>
          </Link>{' '}
          if you already have an account
        </p>
      </form>
    </>
  )
}
