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
      <h1 className="gradient-text text-3xl md:text-4xl mb-6 pb-4 font-bold">
        Hello {user.name}
      </h1>
      <APIKey apiToken={apiToken} />
      <LegacyUsage />
      {/* <Usage /> */}
    </DashboardLayout>
  )
}
