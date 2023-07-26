import type { ReactElement } from 'react'
import type { BannerProps } from '@/components/pages/Home'
import {
  Banner,
} from '@/components/pages/Home'
import { MainLayout } from '@/components/layouts'
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
   </MainLayout>
  )
}
