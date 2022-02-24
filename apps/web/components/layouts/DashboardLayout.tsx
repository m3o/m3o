import type { ComponentType, ComponentProps } from 'react'
import type { ReactElement, PropsWithChildren } from 'react'
import { Fragment, useRef, useState, useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { MainLayout } from './MainLayout'
import { Subscription, RecentlyViewed } from '@/components/pages/Home'
import { Balance } from '@/components/ui'
import { useWindowResizeTrigger, useBillingAccount } from '@/hooks'
import { SubscriptionPlans } from '@/lib/constants'
import {
  HomeIcon,
  CloudIcon,
  SearchIcon,
  ChartBarIcon,
  CashIcon,
  KeyIcon,
  SupportIcon,
  UsersIcon,
  MailIcon,
} from '@heroicons/react/outline'

interface SidebarItem {
  href: string
  external?: boolean
  text: string
  icon: ComponentType<ComponentProps<'svg'>>
}

interface SidebarSection {
  items: (SidebarItem | undefined)[]
  title?: string
}

interface SidebarItemsProps {
  items: SidebarSection[]
}

export function SidebarItems({ items }: SidebarItemsProps): ReactElement {
  const { isMobile } = useWindowResizeTrigger()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useRouter()
  const [menuHeight, setMenuHeight] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isMenuOpen) {
      const height = (menuRef.current?.firstChild as HTMLDivElement)
        .clientHeight
      setMenuHeight(height)
    } else {
      setMenuHeight(0)
    }
  }, [isMenuOpen])

  const link = items
    .flatMap(item => item.items)
    .filter(item => !!item)
    .find(item => item!.href === pathname)!

  return (
    <div>
      <button
        className="md:hidden w-full p-4 text-left flex justify-between"
        onClick={() => setIsMenuOpen(prev => !prev)}>
        {link.text}
        <ChevronDownIcon
          className={classNames('w-6', { 'rotate-180': isMenuOpen })}
        />
      </button>
      <div
        ref={menuRef}
        style={{ height: isMobile ? menuHeight : 'auto' }}
        className="overflow-hidden transition-all border-b md:border-b-0 tbc mb-6">
        <div>
          {items.map((item, i) => (
            <Fragment key={`section-${i}`}>
              {item.title && (
                <h2 className="py-4 px-8 font-bold">{item.title}</h2>
              )}
              <ul className="mt-2 pb-6 md:pb-0">
                {item.items.map(
                  item =>
                    item && (
                      <li key={item.href}>
                        <Link href={item.href}>
                          <a
                            className={classNames(
                              'block py-2 px-8 border-l-4 text-zinc-900 text-sm',
                              {
                                'border-zinc-900 dark:border-zinc-50':
                                  pathname === item.href,
                                'border-transparent': pathname !== item.href,
                              },
                            )}>
                            <item.icon className="w-5 mr-2 align-top inline" />{item.text}
                          </a>
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export function DashboardLayout({
  children,
}: PropsWithChildren<unknown>): ReactElement {
  const { subscriptionLevel } = useBillingAccount()
  const isProUser = subscriptionLevel === SubscriptionPlans.Pro

  return (
    <MainLayout>
      <section className="min-h-screen md:grid md:grid-cols-5">
        <aside className="md:border-r tbc bg-white dark:bg-zinc-900 md:pt-6">
          <SidebarItems
            items={[
              {
                title: 'Navigation',
                items: [
                  {
                    text: 'Home',
                    href: '/',
                    icon: HomeIcon,
                  },
                  {
                    text: 'Cloud',
                    href: 'https://cloud.m3o.com',
                    external: true,
                    icon: CloudIcon,
                  },
                  {
                    text: 'Explore',
                    href: '/explore',
                    icon: SearchIcon,
                  },
                ],
              },
              {
                title: 'Account',
                items: [
                  {
                    text: 'Usage',
                    href: '/account/usage',
                    icon: ChartBarIcon,
                  },
                  {
                    text: 'Billing & Plans',
                    href: '/account/billing',
                    icon: CashIcon,
                  },
                  {
                    text: 'API Keys',
                    href: '/account/keys',
                    icon: KeyIcon,
                  },
                ],
              },
              {
                title: 'Support',
                items: [
                  {
                    text: 'Getting Started',
                    href: '/getting-started',
                    icon: SupportIcon,
                  },
                  {
                    text: 'Community',
                    href: 'https://discord.gg/TBR9bRjd6Z',
                    external: true,
                    icon: UsersIcon,
                  },
                  isProUser
                    ? {
                        text: 'Email',
                        href: 'mailto:support@m3o.com',
                        icon: MailIcon,
                      }
                    : undefined,
                ],
              },
            ]}
          />
        </aside>
        <div className="col-span-4 bg-white dark:bg-zinc-900 p-4 md:p-10 xl:grid xl:grid-cols-3 gap-10">
          <div className="col-span-2">{children}</div>
          <div className="bg-zinc-900 dark:bg-zinc-800 rounded-lg p-8 mt-4 md:mt-10 xl:mt-0">
            <Subscription />
            <Balance />
            <RecentlyViewed />
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
