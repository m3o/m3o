import type { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useSignUp } from '@m3o/auth'
import { EMAIL_REGEX } from '@/lib/constants'
import { Layout } from '@/components/Layout'

interface SignUpFields {
  email: string
  password: string
  profile: {
    firstName: string
    lastName: string
  }
}

const SignUp: NextPage = () => {
  const router = useRouter()
  const { handleSubmit, register, formState } = useForm<SignUpFields>()

  const { signUp, error } = useSignUp({
    onSuccess: () => {
      router.push('/')
    }
  })

  return (
    <Layout>
      <div className="card">
        <h1 className="card-title">Sign Up</h1>
        {error && <p className="error-alert">{error}</p>}
        <form onSubmit={handleSubmit(signUp)}>
          <div className="form-field">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              {...register('profile.firstName', {
                required: {
                  value: true,
                  message: 'Please provide your first name'
                }
              })}
            />
            {formState.errors.profile?.firstName?.message && (
              <p className="error">
                {formState.errors.profile?.firstName?.message}
              </p>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              {...register('profile.lastName', {
                required: {
                  value: true,
                  message: 'Please provide your last name'
                }
              })}
            />
            {formState.errors.profile?.lastName?.message && (
              <p className="error">
                {formState.errors.profile?.lastName?.message}
              </p>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              {...register('email', {
                pattern: {
                  value: EMAIL_REGEX,
                  message: 'Please provide a valid email address'
                },
                required: {
                  value: true,
                  message: 'Please provide an email address'
                }
              })}
            />
            {formState.errors.email?.message && (
              <p className="error">{formState.errors.email?.message}</p>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              min={8}
              {...register('password', {
                min: {
                  value: 8,
                  message: 'Please provide a password longer than 8 characters'
                },
                required: {
                  value: true,
                  message: 'Please provide a password'
                }
              })}
            />
            {formState.errors.password?.message && (
              <p className="error">{formState.errors.password?.message}</p>
            )}
          </div>
          <button className="btn" data-testid="sign-up-button">
            Submit
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default SignUp
