import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { MainLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'

import {
  Faqs,
} from '@/components/pages/Home'

export const getServerSideProps = withAuth(async context => {
  return {
    props: {
      user: context.req.user,
    },
  }
})

const FAQ: NextPage = () => {
  return (
    <>
      <NextSeo {...seo.faq} />
      <MainLayout>
        <section className="py-20">
          <div className="m3o-container">
            <Faqs />
          </div>
        </section>
      </MainLayout>
    </>
  )
}

export default FAQ
