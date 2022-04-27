import type { ReactElement, PropsWithChildren } from 'react'
import Link from 'next/link'

export interface Props {
  categories: string[]
  onCategoryClick: VoidFunction
}

interface CategoryLinkProps {
  href: string
  onClick: Props['onCategoryClick']
}

function CategoryLink({
  children,
  onClick,
  href,
}: PropsWithChildren<CategoryLinkProps>) {
  return (
    <Link href={href}>
      <a className="block capitalize mb-4" onClick={onClick}>
        {children}
      </a>
    </Link>
  )
}

export function CategoriesFilter({
  categories,
  onCategoryClick,
}: Props): ReactElement {
  return (
    <>
      <CategoryLink onClick={onCategoryClick} href="/explore">
        All APIs
      </CategoryLink>
      <h3 className="text-zinc-800 mb-4 font-bold dark:text-white">
        Categories
      </h3>
      {categories.map(category => (
        <CategoryLink
          onClick={onCategoryClick}
          href={`/explore/${category}`}
          key={category}>
          {category}
        </CategoryLink>
      ))}
    </>
  )
}
