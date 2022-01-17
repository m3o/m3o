import type { FC } from 'react'

interface Props {
  title: string
}

export const UserDetail: FC<Props> = ({ children, title }) => {
  return (
    <div className="flex even:bg-zinc-800">
      <div className="w-1/2 p-4">{title}</div>
      <div className="w-1/2 p-4">{children ? children : '-'}</div>
    </div>
  )
}
