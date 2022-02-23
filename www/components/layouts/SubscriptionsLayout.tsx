import type { FC } from 'react'
import { GradientHeading } from '@/components/ui'
import { MainLayout } from './MainLayout'

export const SubscriptionsLayout: FC = ({ children }) => {
  return (
    <MainLayout>
      <div className="flex justify-center py-20 min-h-screen">
        <div className="w-1/2 max-w-lg">
          <h1 className="text-2xl mb-3 gradient-text font-bold">M3O Pro</h1>
          <div className="dark:bg-zinc-800 border tbc p-10 rounded-md">
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
