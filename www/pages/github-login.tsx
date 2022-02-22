import type { NextPage } from 'next'
import { useEffect } from 'react'
import { useOAuthCallback } from '@/hooks'
import { OAuthCallbackRequest } from '@/lib/api/m3o/services/auth'

const isDevelopment = process.env.NODE_ENV === 'development'

const GithubLogin: NextPage = () => {
  const callback = useOAuthCallback('/user/github-login')

  useEffect(() => {
    const params: OAuthCallbackRequest = { test: isDevelopment }
    const searchParams = new URLSearchParams(window.location.search)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const errorReason = searchParams.get('error_reason')

    if (code) {
      params.code = code
    }

    if (state) {
      params.state = state
    }

    if (errorReason) {
      params.error_reason = errorReason
    }

    callback.mutate(params)
  }, [])

  return (
    <div className="m3o-container py-10">
      <h1 className="mb-4 font-bold">Logging in with Github</h1>
      <p>Please wait...</p>
    </div>
  )
}

export default GithubLogin
