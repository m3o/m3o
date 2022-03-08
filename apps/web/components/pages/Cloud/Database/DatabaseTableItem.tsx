import type { FC } from 'react'
import Link from 'next/link'

interface Props {
  name: string
}

export function DatabaseTableItem({ name }: Props) {
  return (
    <div data-testid={name}>
      <Link href={`/cloud/database/${name}`}>
        <a className="p-8 block dark:bg-zinc-800 bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors">
          {name}
        </a>
      </Link>
    </div>
  )
}
