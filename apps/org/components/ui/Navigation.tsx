import type { FC } from 'react'
import type { HeaderLink } from './Header/Header.types'
import Link from 'next/link'

interface Props {
  links: HeaderLink[]
}

const LINK_CLASSES =
  'font-medium block ml-8 text-zinc-800 text-sm hover:text-pink-500 transition-colors dark:text-white'

export const Navigation: FC<Props> = ({ links }) => {
  function renderLink(item: HeaderLink) {
    if (item.external) {
      return (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className={LINK_CLASSES}>
          {item.text}
        </a>
      )
    }

    return (
      <Link href={item.link}>
        <a className={LINK_CLASSES}>{item.text}</a>
      </Link>
    )
  }

  return (
    <nav className="ml-6 hidden md:block">
      <ul className="flex items-center">
        {links.map(item => (
          <li key={item.text}>{renderLink(item)}</li>
        ))}
      </ul>
    </nav>
  )
}
