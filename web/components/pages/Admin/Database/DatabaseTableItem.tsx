import type { FC } from 'react'
import Link from 'next/link'

interface Props {
  name: string
}

export function DatabaseTableItem({ name }: Props) {
  return (
    <div data-testid={name}>
      <Link href={`/admin/database/${name}`}>
        <a className="p-3 block bg-zinc-800 text-white hover:font-medium hover:bg-zinc-700 rounded-md transition-colors">
          {name}
        </a>
      </Link>
    </div>
  )
}
