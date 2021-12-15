import type { Account } from 'm3o/user'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { user } from './user'
import { CONFIG } from './config'

export interface WithAuthProps {
  user: Account | null
}

interface HandlerArgs {
  context: GetServerSidePropsContext
  user: Account | null
}

type Handler<P extends Record<string, any>> =
  | ((args: HandlerArgs) => GetServerSidePropsResult<P>)
  | ((args: HandlerArgs) => Promise<GetServerSidePropsResult<P>>)

interface WithAuth<P extends Record<string, any>> {
  redirectOnAuthFailure?: boolean | string
  onAuthentication?: Handler<P>
}

export function withAuth<P extends Record<string, any>>({
  onAuthentication,
  redirectOnAuthFailure
}: WithAuth<P> = {}) {
  return async (context: GetServerSidePropsContext) => {
    let account: Account | null = null

    const { cookies } = context.req

    try {
      // If the cookie exists
      if (cookies[CONFIG.USER_COOKIE_NAME]) {
        const { session } = await user.readSession({
          sessionId: cookies[CONFIG.USER_COOKIE_NAME]
        })

        const userReadResponse = await user.read({
          id: session!.userId
        })

        // Not sure this will ever be null
        account = userReadResponse.account || null
      }
    } catch (e) {
      // Handle this error somehow
      console.log(e)
    }

    if (redirectOnAuthFailure && !account) {
      return {
        redirect: {
          destination:
            typeof redirectOnAuthFailure === 'string'
              ? redirectOnAuthFailure
              : '/',
          permanent: false
        }
      }
    }

    if (onAuthentication) {
      const callbackResponse = await onAuthentication({
        context,
        user: account
      })

      if ('redirect' in callbackResponse || 'notFound' in callbackResponse) {
        return callbackResponse
      }

      return {
        props: {
          ...callbackResponse.props,
          user: account
        }
      }
    }

    return {
      props: { user: account }
    }
  }
}
