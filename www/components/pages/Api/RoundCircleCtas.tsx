import type { FC, ComponentPropsWithoutRef } from 'react'
import classNames from 'classnames'
import Link, { LinkProps } from 'next/link'
import { CloudIcon, TrendingUpIcon } from '@heroicons/react/outline'
import ReactTooltip from 'react-tooltip'
import { Routes } from '@/lib/constants'

interface Props {
  apiName: string
  canManageOnCloud?: boolean
}

interface RoundCircleCtaLinkProps extends LinkProps {
  toolTip: string
}

const SHARED_CLASSES =
  'w-12 bg-white h-12 block rounded-full flex items-center justify-center text-black dark:text-black shadow-md'

const RoundCircleCtaExternalLink: FC<
  ComponentPropsWithoutRef<'a'> & { toolTip: string }
> = ({ children, toolTip, ...props }) => {
  const classes = classNames(SHARED_CLASSES)

  return (
    <a {...props} className={classes} data-for="main" data-tip={toolTip}>
      {children}
    </a>
  )
}

const RoundCircleCtaLink: FC<RoundCircleCtaLinkProps> = ({
  href,
  children,
  toolTip,
}) => {
  const classes = classNames(SHARED_CLASSES)

  return (
    <Link href={href}>
      <a className={classes} data-for="main" data-tip={toolTip}>
        {children}
      </a>
    </Link>
  )
}

export const RoundCircleCtas: FC<Props> = ({
  apiName,
  canManageOnCloud = false,
}) => {
  return (
    <div>
      <ul className="flex items-center">
        <li>
          <RoundCircleCtaLink
            href={{
              pathname: Routes.Trending,
              query: {
                api: apiName,
              },
            }}
            toolTip="See where this API is trending">
            <TrendingUpIcon className="w-5" />
          </RoundCircleCtaLink>
        </li>
        {canManageOnCloud && (
          <li className="ml-3">
            <RoundCircleCtaExternalLink
              href="https://cloud.m3o.com"
              target="_blank"
              rel="noreferrer"
              toolTip="Manage your data on M3O Cloud">
              <CloudIcon className="w-5" />
            </RoundCircleCtaExternalLink>
          </li>
        )}
      </ul>
      <ReactTooltip id="main" effect="solid" className="bg-black text-white" />
    </div>
  )
}
