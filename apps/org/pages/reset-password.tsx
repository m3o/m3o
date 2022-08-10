import type { NextPage } from 'next'
import { useRef } from 'react'
import { NextSeo } from 'next-seo'
import { MainLayout } from '@/components/layouts'
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
        <div className="h-screen">
          <div className="m3o-container pt-6">
            <div className="md:flex max-w-2xl mx-auto items-center justify-center md:w-full">
              <div className="p-10 w-11/12 max-w-lg tbgc rounded-lg">
                <h1 className="font-bold text-xl text-black mb-6 dark:text-white">
                  Reset your password
                </h1>
                {fetchRecoveryCode.isSuccess ? (
                  <VerifyCode
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
                    onSubmit={onResetPasswordFormSubmit}
                    isLoading={fetchRecoveryCode.isLoading}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default ResetPassword
