import { LandingPageExampleNames } from '@/lib/constants'

interface SidebarExampleButton {
  text: string
  example: LandingPageExampleNames
}

export interface SidebarItem {
  title: string
  items: SidebarExampleButton[]
}
