import type { FC } from 'react'
import { Service } from './Service'

export interface ServicesGridProps {
  services: ExploreAPI[]
}

export const ServicesGrid: FC<ServicesGridProps> = ({ services }) => {
  return (
    <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {services.map(service => (
        <Service key={service.name} {...service} />
      ))}
    </div>
  )
}
