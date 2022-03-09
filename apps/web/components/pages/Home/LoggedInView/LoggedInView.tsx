import type { FC } from 'react'
import { Usage, LegacyUsage } from '@/components/pages/User'
import { APIKey } from './Widgets/APIKey'
import { DashboardLayout } from '@/components/layouts'

interface LoggedInViewProps {
  apiToken: string
  user: Account
}

export const LoggedInView: FC<LoggedInViewProps> = ({ apiToken, user }) => {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-10">
        <h1 className="text-3xl mb-6 pb-4 font-medium gradient-text">
          Hello {user.name}
        </h1>
        <APIKey apiToken={apiToken} />
        <LegacyUsage />
      </div>
      {/* <Usage /> */}
    </DashboardLayout>
  )
}
