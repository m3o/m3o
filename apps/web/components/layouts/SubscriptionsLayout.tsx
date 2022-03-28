import type { FC } from 'react'
import { MainLayout } from './MainLayout'

export const SubscriptionsLayout: FC = ({ children }) => {
  return (
    <MainLayout>
      <div className="flex justify-center md:py-20 py-10 min-h-screen px-8">
        <div className="md:w-1/2 max-w-lg">
          <h1 className="text-2xl mb-3 gradient-text font-bold">
            M3O Subscriptions
          </h1>
          <div className="dark:bg-zinc-800 border tbc p-6 md:p-10 rounded-md">
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
