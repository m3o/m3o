import type { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import { useEmailLogin } from '@m3o/auth'
import { useRouter } from 'next/router'
import { Layout } from '@/components/Layout'
import { EMAIL_REGEX } from '@/lib/constants'

interface LoginFormFields {
  email: string
  password: string
}

const Login: NextPage = () => {
  const router = useRouter()
  const { handleSubmit, register, formState } = useForm<LoginFormFields>()

  const { login, error } = useEmailLogin({
    onSuccess: () => {
      router.push('/')
    }
  })

  return (
    <Layout>
      <div className="card">
        <h1 className="card-title">Login</h1>
        {error && <p className="error-alert">{error}</p>}
        <form onSubmit={handleSubmit(login)}>
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
              {...register('password', {
                required: {
                  value: true,
                  message: 'Please provide your password'
                }
              })}
            />
            {formState.errors.password?.message && (
              <p className="error">{formState.errors.password?.message}</p>
            )}
          </div>
          <button className="btn" data-testid="submit-button">
            Submit
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default Login
