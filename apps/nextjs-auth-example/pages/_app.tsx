import type { AppProps } from 'next/app'
import { AuthProvider } from '@m3o/auth'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const { user } = pageProps

  return (
    <AuthProvider user={user}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
