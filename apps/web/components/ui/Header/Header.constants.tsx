import { Routes } from '@/lib/constants'
import type { HeaderLink } from './Header.types'
import { CloudIcon } from '@heroicons/react/outline'

interface MenuItem {
  link: Routes
  text: string
}

export const LOGGED_IN_MENU_ITEMS: MenuItem[] = [
  {
    link: Routes.Home,
    text: 'Home',
  },
  {
    link: Routes.UserUsage,
    text: 'Usage',
  },
  {
    link: Routes.UserBilling,
    text: 'Billing & Plans',
  },
  {
    link: Routes.UserKeys,
    text: 'API Keys',
  },
]

export const LOGGED_OUT_HEADER_LINKS: HeaderLink[] = [
  {
    link: Routes.Explore,
    text: 'Explore',
  },
  {
    link: Routes.Playground,
    text: 'Playground',
  },
  {
    link: Routes.Pricing,
    text: 'Pricing',
  },
  {
    link: 'https://status.m3o.com',
    text: 'Status',
    external: true,
  },
]

export const LOGGED_IN_HEADER_LINKS: HeaderLink[] = []
