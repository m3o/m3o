import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { MainLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'

import {
  AboutUs,
  AWSComparison,
  Banner,
  OfferApiBanner,
  SellingPoints,
} from '@/components/pages/About'

export const getServerSideProps = withAuth(async context => {
  return {
    props: {
      user: context.req.user,
    },
  }
})

const About: NextPage = () => {
  return (
    <>
      <NextSeo {...seo.about} />
      <MainLayout>
        <Banner />
        <AboutUs />
      </MainLayout>
    </>
  )
}

export default About
