import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { OAuthSignInButtons, Alert, Button, TextInput } from '@/components/ui'
import { MainLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import { useLogin } from '@/hooks'
import seo from '@/lib/seo.json'
import { SessionStorageKeys } from '@/lib/constants'
import { sessionStorage } from '@/utils/storage'

export const getServerSideProps = withAuth(async context => {
  return {
    props: {
      user: context.req.user,
    },
  }
})

const Login: NextPage = () => {
  const [showSuccessfullyRegistered, setShowSuccessfullyRegistered] =
    useState(false)
  const loginMutation = useLogin()
  const { handleSubmit, control } = useForm<LoginFormFields>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)

    /**
     * This is for cloud redirection.
     */
    const redirectTo = searchParams.get('redirect')

    /**
     * Check the url for a successful *email* register redirect
     */
    const successfulEmailRegister = searchParams.get('successful_register')

    /** Check for subscription click */
    const subscriptionHasBeenClicked = searchParams.get('subscription')

    if (redirectTo) {
      // Set this so after google or github login the user can be returned to cloud.
      sessionStorage.setItem(
        SessionStorageKeys.RedirectToAfterLogin,
        redirectTo,
      )
    }

    if (subscriptionHasBeenClicked) {
      sessionStorage.setItem(
        SessionStorageKeys.SubscriptionFlow,
        subscriptionHasBeenClicked,
      )
    }

    if (successfulEmailRegister) {
      setShowSuccessfullyRegistered(true)
    }
  }, [])

  // console.log(loginMutation.error?.response?.data.detail)

  return (
    <>
      <NextSeo
        title={seo.login.title}
        description={seo.login.description}
        canonical="https://m3o.com/login"
      />
      <MainLayout>
        <div className="h-screen bg-white dark:bg-zinc-900">
          <div className="md:flex max-w-7xl mx-auto flex items-center justify-center py-8">
            <div className="p-10 w-11/12 max-w-lg tbgc rounded-lg">
              {showSuccessfullyRegistered && !loginMutation.error && (
                <Alert
                  className="mb-6"
                  testId="register-successful-register-alert">
                  Successfully registered. Please login
                </Alert>
              )}
              <h1 className="font-bold text-3xl mb-6 text-black dark:text dark:text-white">
                Log in
              </h1>
              <OAuthSignInButtons footerText="or sign in with your email" />
              <form
                onSubmit={handleSubmit((values: LoginFormFields) =>
                  loginMutation.mutate(values),
                )}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { ref, ...field } }) => {
                    return <TextInput {...field} label="Email" type="email" />
                  }}
                />
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { ref, ...field } }) => (
                    <TextInput {...field} label="Password" type="password" />
                  )}
                />
                <Button
                  loading={loginMutation.isLoading}
                  className="w-full mb-8 justify-center"
                  data-testid="login-submit">
                  Submit
                </Button>
                <p className="my-4 text-zinc-700 dark:text-zinc-300">
                  Not registered yet?
                  <Link href="/register">
                    <a className="inline-block ml-2">Create an account</a>
                  </Link>
                </p>
                <p>
                  <Link href="/reset-password">
                    <a>Forgotten your password?</a>
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default Login
