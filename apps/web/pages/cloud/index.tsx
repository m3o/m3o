import { NextSeo } from 'next-seo'
import Link from 'next/link'
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

export default function Cloud() {
  return (
    <>
      <NextSeo {...seo.about} />
      <MainLayout>
        Cloud
        <Link href="/cloud/apps">
          <a>Apps</a>
        </Link>
      </MainLayout>
    </>
  )
}
