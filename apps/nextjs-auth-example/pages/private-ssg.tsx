import type { NextPage } from 'next'
import { useAuthNextSSG } from '@m3o/auth'

const PrivateClient: NextPage = () => {
  const { user, isAuthenticating } = useAuthNextSSG({ redirectTo: '/' })

  if (isAuthenticating) {
    return <p>Loading...</p>
  }

  return <div>{user.email}</div>
}

export default PrivateClient
