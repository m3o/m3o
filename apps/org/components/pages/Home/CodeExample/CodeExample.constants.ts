import type { SidebarItem } from './CodeExample.types'
import type { Languages } from '@/types'
import { LandingPageExampleNames } from '@/lib/constants'

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: 'Cache',
    items: [
      {
        text: 'Set a value',
        example: LandingPageExampleNames.CacheSet,
      },
      {
        text: 'Get a value',
        example: LandingPageExampleNames.CacheGet,
      },
    ],
  },
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
