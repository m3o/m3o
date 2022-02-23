import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { AuthCookieNames } from '@/lib/constants'
import { getUserToken, inspectUser } from './services/auth'
import { serializeCookie } from '@/lib/cookie'

export interface WithAuthProps {
  user: Account | null
}

interface WithAuth extends GetServerSidePropsContext {
  req: GetServerSidePropsContext['req'] & { user: Account | null }
}

type Handler = (args: WithAuth) => ReturnType<GetServerSideProps>

export function withAuth(fn: Handler) {
  return async (context: GetServerSidePropsContext) => {
    let account: Account | null = null
    let microToken

    const { cookies } = context.req

    try {
      if (cookies[AuthCookieNames.Token]) {
        // Get the refresh token...
        const token = await getUserToken(context.req)

        if (typeof token !== 'string') {
          microToken = token.access_token

          context.res.setHeader('Set-Cookie', [
            serializeCookie(AuthCookieNames.Token, token.access_token),
            serializeCookie(AuthCookieNames.Refresh, token.refresh_token),
            serializeCookie(AuthCookieNames.Expiry, token.expiry),
            serializeCookie(AuthCookieNames.Namespace, 'micro'),
          ])
        } else {
          microToken = token
        }

        const inspectResponse = await inspectUser({
          microToken,
          namespace: cookies[AuthCookieNames.Namespace],
        })

        account = inspectResponse.account
      }
    } catch (e) {
      // console.log(e)
    }

    return await fn({
      ...context,
      req: Object.assign({}, context.req, { user: account }),
    })
  }
}
