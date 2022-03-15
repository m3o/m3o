import type { FC } from 'react'
import { Usage, LegacyUsage } from '@/components/pages/User'
import { APIKey } from './Widgets/APIKey'
import { DashboardLayout } from '@/components/layouts'
import { Subscription, RecentlyViewed } from '@/components/pages/Home'
import { Balance } from '@/components/ui'

interface LoggedInViewProps {
  apiToken: string
  user: Account
}

export const LoggedInView: FC<LoggedInViewProps> = ({ apiToken, user }) => {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 md:grid gap-6 lg:grid-cols-3 xl:grid-cols-7">
        <div className="lg:col-span-2 xl:col-span-5 md:px-10">
          <APIKey apiToken={apiToken} />
          <LegacyUsage />
        </div>
        <div className="rounded-lg xl:col-span-2 mt-6 md:mt-0">
          <div className="bg-zinc-900 dark:bg-zinc-800 rounded-lg p-8 mt-6 md:mt-0 mb-6">
            <Subscription />
          </div>
          <div className="bg-zinc-900 dark:bg-zinc-800 rounded-lg p-8 mt-6 md:mt-0 mb-6">
            <Balance />
          </div>
          <div className="bg-zinc-900 dark:bg-zinc-800 rounded-lg p-8 mt-6 md:mt-0 mb-6">
            <RecentlyViewed />
          </div>
        </div>
      </div>
      {/* <Usage /> */}
    </DashboardLayout>
  )
}
