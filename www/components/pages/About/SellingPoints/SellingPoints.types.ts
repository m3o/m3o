import { ComponentType } from 'react'

export type SellingPointProps = {
  Icon: ComponentType<{ className?: string }>
  description: string
  title: string
}
