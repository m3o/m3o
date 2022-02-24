import type { ReactElement } from 'react'
import type { BannerProps } from '@/components/pages/Home'
import {
  Banner,
  SubscribeSection,
  WhatIsM3O,
  HowToGetStarted,
  CloudBanner,
  Pricing,
} from '@/components/pages/Home'
import { MainLayout } from '@/components/layouts'
import { ServicesGrid } from '@/components/ui'

interface Props extends BannerProps {
  services: ExploreAPI[]
}

export function Landing({
  services,
  heading,
  subHeading,
}: Props): ReactElement {
  return (
    <MainLayout>
      <Banner heading={heading} subHeading={subHeading} />
      <WhatIsM3O>
        <ServicesGrid services={services} />
      </WhatIsM3O>
      <HowToGetStarted />
      <Pricing />
      <CloudBanner />
      <SubscribeSection />
    </MainLayout>
  )
}
