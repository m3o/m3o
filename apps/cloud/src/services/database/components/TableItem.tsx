import type { FC } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  name: string
}

export const TableItem: FC<Props> = ({ name }) => {
  return (
    <div data-testid={name}>
      <Link to={`/database/${name}`}>
        <a className="p-8 block bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors">
          {name}
        </a>
      </Link>
    </div>
  )
}
