import type { FC } from 'react'
import { Footer, Header } from '@/components/ui'

export const MainLayout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <main className="dark:bg-zinc-900">{children}</main>
      <Footer />
    </>
  )
}
