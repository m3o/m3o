import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { sendPasswordReset, verifyPasswordReset } from '../lib/user'
import styles from './login.module.scss'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [code, setCode] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [emailSent, setEmailSent] = useState<boolean>(false)
  const [error, setError] = useState<string>(null)

  function onSubmit(e: React.FormEvent): void {
    e.preventDefault()

    if (!emailSent) {
      setLoading(true)
      sendPasswordReset(email)
        .then(() => {
          setError(null)
          setEmailSent(true)
          setLoading(false)
        })
        .catch((err: any) => {
          setError(err)
          setLoading(false)
        })
      return
    }

    if (passwordConfirmation !== password) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    verifyPasswordReset(email, code, password)
      .then(() => {
        window.location.href = '/'
      })
      .catch((err: any) => {
        setError(err)
        setLoading(false)
      })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Login | Micro</title>
      </Head>

      <div className={styles.inner}>
        <img className={styles.logo} src="/logo.png" height="50px" alt="M3O Logo" />
        <h1 className={styles.title}>Chat</h1>
        {error ? (
          <p className={styles.error}>{JSON.stringify(error, null, 2)}</p>
        ) : null}

        <form className={styles.form} onSubmit={onSubmit}>
          <label>Email address</label>
          <input
            required
            autoFocus
            type="email"
            value={email}
            disabled={loading || emailSent}
            placeholder="johndoe@chat.app"
            onChange={(e) => setEmail(e.target.value || '')}
          />

          {emailSent ? (
            <label>Enter the 8 digit code we emailed you</label>
          ) : null}
          {emailSent ? (
            <input
              required
              autoFocus
              type="text"
              value={code}
              disabled={loading}
              placeholder="12345678"
              minLength={8}
              maxLength={8}
              onChange={(e) => setCode(e.target.value || '')}
            />
          ) : null}

          {emailSent ? <label>New Password</label> : null}
          {emailSent ? (
            <input
              required
              type="password"
              value={password}
              disabled={loading}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value || '')}
            />
          ) : null}

          {emailSent ? <label>Password Confirmation</label> : null}
          {emailSent ? (
            <input
              required
              type="password"
              value={passwordConfirmation}
              disabled={loading}
              placeholder="Password Confirmation"
              onChange={(e) => setPasswordConfirmation(e.target.value || '')}
            />
          ) : null}

          <input
            type="submit"
            disabled={
              loading ||
              (emailSent
                ? (code.length !== 8 && password.length === 0) ||
                  passwordConfirmation.length === 0
                : !email.length)
            }
            value="Submit"
          />
        </form>

        <p onClick={() => router.push('/login')} className={styles.switch}>
          Remembered password
        </p>
      </div>
    </div>
  )
}
