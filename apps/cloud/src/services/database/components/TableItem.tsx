import type { FC } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  name: string
}

export const TableItem: FC<Props> = ({ name }) => {
  return (
    <div data-testid={name} className="bg-zinc-800 rounded-md p-8">
      <h4 className="font-bold">
        <Link to={`/database/${name}`}>{name}</Link>
      </h4>
    </div>
  )
}
