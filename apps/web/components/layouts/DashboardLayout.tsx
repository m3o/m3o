import type { ComponentType, ComponentProps } from 'react'
import type { ReactElement, PropsWithChildren } from 'react'
import { Fragment, useRef, useState, useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { MainLayout } from './MainLayout'
import { useWindowResizeTrigger, useBillingAccount } from '@/hooks'
import { SubscriptionPlans } from '@/lib/constants'
import {
  HomeIcon,
  HeartIcon,
  CodeIcon,
  SearchIcon,
  ServerIcon,
  ChartBarIcon,
  UserGroupIcon,
  DatabaseIcon,
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
        Navigation
        <ChevronDownIcon
          className={classNames('w-6', { 'rotate-180': isMenuOpen })}
        />
      </button>
      <div
        ref={menuRef}
        style={{ height: isMobile ? menuHeight : 'auto' }}
        className="overflow-hidden transition-all border-b md:border-b-0 tbc">
        <div>
          {items.map((item, i) => (
            <Fragment key={`section-${i}`}>
              {item.title && (
                <h2 className="py-4 px-8 font-medium">{item.title}</h2>
              )}
              <ul className="pb-6 md:pb-0 mb-2">
                {item.items.map(
                  item =>
                    item && (
                      <li key={item.href}>
                        <Link href={item.href}>
                          <a
                            className={classNames(
                              'flex items-center py-2 px-12 text-sm text-zinc-900 dark:text-zinc-300',
                            )}>
                            <item.icon className="w-6 mr-2" />
                            {item.text}
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
      <section className="min-h-screen md:grid md:grid-cols-6">
        <aside className=" bg-white dark:bg-zinc-900 md:pt-6 md:border-r tbc">
          <SidebarItems
            items={[
              {
                title: 'Public',
                items: [
                  {
                    text: 'Home',
                    href: '/',
                    icon: HomeIcon,
                  },
                  {
                    text: 'Explore',
                    href: '/explore',
                    icon: SearchIcon,
                  },
                  {
                    text: 'Status',
                    href: 'https://status.m3o.com',
                    icon: HeartIcon,
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
        <div className="col-span-5 bg-white dark:bg-zinc-900">{children}</div>
      </section>
    </MainLayout>
  )
}
