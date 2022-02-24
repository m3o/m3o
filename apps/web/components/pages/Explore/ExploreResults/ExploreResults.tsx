import type { FC } from 'react'
import { ServicesGrid } from '@/components/ui'
import { NoResults } from './NoResults'

interface Props {
  services: ExploreAPI[]
}

export const ExploreResults: FC<Props> = ({ services }) => {
  if (services.length === 0) {
    return <NoResults />
  }

  return <ServicesGrid services={services} />
}
