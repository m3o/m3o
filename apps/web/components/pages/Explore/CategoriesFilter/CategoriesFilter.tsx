import type { ReactElement, PropsWithChildren } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import classNames from 'classnames'

export interface Props {
  route: string
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
          'block capitalize py-2 px-4 text-sm text-black dark:text-white rounded-md',
          {
            'bg-zinc-800 text-white font-medium': selected,
          },
        )}
        onClick={onClick}>
        {children}
      </a>
    </Link>
  )
}

export function CategoriesFilter({
  route,
  categories,
  onCategoryClick,
}: Props): ReactElement {
  const router = useRouter()

  return (
    <>
      <CategoryLink
        onClick={onCategoryClick}
        href={route}
        selected={router.pathname === `${route}`}>
        All APIs
      </CategoryLink>
      <h3 className="text-zinc-800 mb-4 font-bold dark:text-indigo-400 text-lg mt-6">
        Categories
      </h3>
      {categories.map(category => (
        <CategoryLink
          selected={router.asPath === `${route}/${category}`}
          onClick={onCategoryClick}
          href={`${route}/${category}`}
          key={category}>
          {category}
        </CategoryLink>
      ))}
    </>
  )
}
