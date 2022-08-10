import type { FC } from 'react'
import { Footer, Header } from '@/components/ui'

export const MainLayout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
