import type { ReactElement, PropsWithChildren } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import classNames from 'classnames'

export interface Props {
  categories: string[]
  onCategoryClick: VoidFunction
}

interface CategoryLinkProps {
  href: string
  onClick: Props['onCategoryClick']
  selected: boolean
}

function CategoryLink({
  children,
  onClick,
  href,
  selected,
}: PropsWithChildren<CategoryLinkProps>) {
  return (
    <Link href={href}>
      <a
        className={classNames(
          'block capitalize !text-white py-2 px-4 text-sm rounded-md',
          {
            'bg-zinc-800 font-medium': selected,
          },
        )}
        onClick={onClick}>
        {children}
      </a>
    </Link>
  )
}

export function CategoriesFilter({
  categories,
  onCategoryClick,
}: Props): ReactElement {
  const router = useRouter()

  return (
    <>
      <CategoryLink
        onClick={onCategoryClick}
        href="/explore"
        selected={router.pathname === '/explore'}>
        All APIs
      </CategoryLink>
      <h3 className="text-zinc-800 mb-4 font-bold dark:text-indigo-400 text-lg mt-6">
        Categories
      </h3>
      {categories.map(category => (
        <CategoryLink
          selected={router.asPath === `/explore/${category}`}
          onClick={onCategoryClick}
          href={`/explore/${category}`}
          key={category}>
          {category}
        </CategoryLink>
      ))}
    </>
  )
}
