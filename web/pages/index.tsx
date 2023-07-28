import type { ReactElement } from 'react'
import { NextSeo } from 'next-seo'
import seo from '@/lib/seo.json'
import { LoggedInView } from '@/components/pages/Home'
import { WithAuthProps, withAuth } from '@/lib/api/m3o/withAuth'
import { AuthCookieNames, Routes } from '@/lib/constants'

interface Props extends WithAuthProps {
  apiToken: string
}

export const getServerSideProps = withAuth(async context => {
  if (!context.req.user) {
    return {
      redirect: {
        destination: Routes.Login,
        permanent: false,
      },
    }
  }

  return {
    props: {
      apiToken: context.req.cookies[AuthCookieNames.ApiToken] || '',
      user: context.req.user,
    } as Props,
  }
})

export default function Home({
  apiToken,
  user,
}: Props): ReactElement {
  return (
    <>
      <NextSeo
        title={user ? seo.home.title : seo.landing.title}
        description={user ? seo.home.description : seo.landing.description}
        canonical="https://m3o.com"
      />
      {user ? (
        <LoggedInView user={user} apiToken={apiToken} />
      ) : (<div></div>) }
    </>
  )
}
