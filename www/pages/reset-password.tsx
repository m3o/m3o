import type { NextPage } from 'next'
import { useRef } from 'react'
import { NextSeo } from 'next-seo'
import { MainLayout } from '@/components/layouts'
import { Card } from '@/components/ui'
import {
  ResetPasswordForm,
  ResetPasswordFormFields,
  VerifyCode,
} from '@/components/pages/ResetPassword'
import { useFetchRecoveryCode, useResetPassword } from '@/hooks'
import seo from '@/lib/seo.json'

const ResetPassword: NextPage = () => {
  const emailRef = useRef('')
  const fetchRecoveryCode = useFetchRecoveryCode()
  const resetPassword = useResetPassword()

  const onResetPasswordFormSubmit = ({ email }: ResetPasswordFormFields) => {
    fetchRecoveryCode.mutate(email)
    emailRef.current = email
  }

  return (
    <>
      <NextSeo
        title={seo.resetPassword.title}
        description={seo.resetPassword.description}
        canonical="https://m3o.com/reset-password"
      />
      <MainLayout>
        <div className="h-screen bg-zinc-100 dark:bg-zinc-800">
          <div className="m3o-container pt-6">
            <div className="md:flex max-w-2xl mx-auto items-center justify-center md:w-full">
              <Card className="p-6 w-full">
                <h1 className="font-black text-xl text-black mb-6 dark:text-white">
                  Reset your password
                </h1>
                {fetchRecoveryCode.isSuccess ? (
                  <VerifyCode
                    error={
                      resetPassword.error
                        ? (resetPassword.error as ApiError).Detail
                        : undefined
                    }
                    isLoading={resetPassword.isLoading}
                    onSubmit={values =>
                      resetPassword.mutate({
                        ...values,
                        email: emailRef.current,
                      })
                    }
                  />
                ) : (
                  <ResetPasswordForm
                    error={
                      fetchRecoveryCode.error
                        ? (fetchRecoveryCode.error as ApiError).Detail
                        : undefined
                    }
                    onSubmit={onResetPasswordFormSubmit}
                    isLoading={fetchRecoveryCode.isLoading}
                  />
                )}
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default ResetPassword
