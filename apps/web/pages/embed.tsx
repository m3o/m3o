import type { ReactElement } from 'react'
import { NextSeo } from 'next-seo'
import { MainLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'

export const getServerSideProps = withAuth(async context => {
  return {
    props: {
      user: context.req.user,
    },
  }
})

export default function Embed(): ReactElement {
  return (
    <>
      <NextSeo {...seo.about} />
      <MainLayout>
        <section className="py-20">
          <div className="m3o-container">
            <h1 className="gradient-text text-6xl font-bold mb-4">
              Build Faster.
            </h1>
            <h2 className="text-zinc-500 text-xl dark:text-zinc-400 font-medium">
              Pre-built widgets that allow for{' '}
              <span className="gradient-text">rapid development</span> and easy
              M3O integration
            </h2>
          </div>
        </section>
      </MainLayout>
    </>
  )
}
