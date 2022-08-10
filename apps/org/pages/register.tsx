import type { FC } from 'react'
import type { VerifySignUpPayload } from '@/types'
import { NextSeo } from 'next-seo'
import { useRef, useEffect } from 'react'
import { MainLayout } from '@/components/layouts'
import { useRegister, useVerifySignUp } from '@/hooks'
import { withAuth } from '@/lib/api/m3o/withAuth'
import { Alert } from '@/components/ui'
import {
  SignUpForm,
  SignUpFormFields,
  VerifySignUpForm,
} from '@/components/pages/Register'
import { SessionStorageKeys } from '@/lib/constants'
import seo from '@/lib/seo.json'

export const getServerSideProps = withAuth(async context => {
  return {
    props: {
      user: context.req.user,
    },
  }
})

const Register: FC = () => {
  const emailRef = useRef('')
  const register = useRegister()
  const verifySignUp = useVerifySignUp()

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const subscriptionHasBeenClicked = searchParams.get('subscription')

    if (subscriptionHasBeenClicked) {
      sessionStorage.setItem(
        SessionStorageKeys.SubscriptionFlow,
        subscriptionHasBeenClicked,
      )
    }
  }, [])

  function onRegister(fields: SignUpFormFields) {
    register.mutate(fields)
    emailRef.current = fields.email
  }

  function onVerifySignUp(fields: Omit<VerifySignUpPayload, 'email'>) {
    verifySignUp.mutate({ ...fields, email: emailRef.current })
  }

  return (
    <>
      <NextSeo
        title={seo.register.title}
        description={seo.register.description}
        canonical="https://m3o.com/register"
      />
      <MainLayout>
        <div className="h-screen bg-white dark:bg-zinc-900 ttc">
          <div className="md:flex max-w-7xl mx-auto flex items-center justify-center py-8">
            <div className="w-11/12 max-w-lg p-4 md:p-10 tbgc rounded-lg">
              <h1 className="font-bold text-3xl mb-4 text-black dark:text-white">
                Sign up
              </h1>
              {register.error && (
                <Alert className="mb-6" type="error" testId="register-error">
                  {register.error as string}
                </Alert>
              )}
              {register.isSuccess ? (
                <VerifySignUpForm
                  onSubmit={onVerifySignUp}
                  isLoading={verifySignUp.isLoading}
                />
              ) : (
                <>
                  <p class="mb-4">Create a free account and get started now</p>
                  <SignUpForm
                    onSubmit={onRegister}
                    isLoading={register.isLoading}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default Register
