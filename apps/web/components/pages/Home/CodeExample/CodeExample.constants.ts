import type { SidebarItem } from './CodeExample.types'
import type { Languages } from '@/types'
import { LandingPageExampleNames } from '@/lib/constants'

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: 'DB',
    items: [
      {
        text: 'Create a record',
        example: LandingPageExampleNames.DbCreate,
      },
      {
        text: 'List records',
        example: LandingPageExampleNames.DbList,
      },
    ],
  },
  {
    title: 'Users',
    items: [
      {
        text: 'Create a user',
        example: LandingPageExampleNames.UserCreate,
      },
      {
        text: 'Login a user',
        example: LandingPageExampleNames.UserLogin,
      },
    ],
  },
]
