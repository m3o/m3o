import { SubscriptionsLayout } from '@/components/layouts'
import Link from 'next/link'
import { withAuth } from '@/lib/api/m3o/withAuth'
import { Routes } from '@/lib/constants'

export const getServerSideProps = withAuth(async context => {
  if (!context.req.user) {
    return {
      redirect: {
        destination: Routes.Home,
        permanent: true,
      },
    }
  }

  return {
    props: {
      user: context.req.user,
    },
  }
})

export default function SubscriptionsSuccess() {
  return (
    <SubscriptionsLayout>
      <h2>Congratulations your subscription sign up was successful!</h2>
      <Link href="/">
        <a className="btn inline-block mt-8">Done</a>
      </Link>
    </SubscriptionsLayout>
  )
}
