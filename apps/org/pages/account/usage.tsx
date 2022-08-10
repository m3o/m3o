import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { DashboardLayout } from '@/components/layouts'
import { Routes } from '@/lib/constants'
import { LegacyUsage } from '@/components/pages/User'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'

interface UsageProps {
  user: Account
}

export const getServerSideProps = withAuth(async context => {
  if (!context.req.user) {
    return {
      redirect: {
        destination: Routes.Home,
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: context.req.user,
    },
  }
})

const Usage: NextPage<UsageProps> = () => {
  return (
    <>
      <NextSeo title={seo.account.usage.title} />
      <DashboardLayout>
        <div className="p-6 md:p-10">
          <h1 className="gradient-text text-3xl mb-6 pb-4 font-medium">
            Usage
          </h1>
          <LegacyUsage showAllResults={true} />
        </div>
      </DashboardLayout>
    </>
  )
}

export default Usage
