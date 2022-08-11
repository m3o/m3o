import type { PropsWithChildren, ReactElement } from 'react'

type Props = {
  label: string
}

export function UserDetailRow({
  label,
  children,
}: PropsWithChildren<Props>): ReactElement {
  return (
    <div className="grid grid-cols-2 p-3 text-sm even:bg-zinc-50 mb-4 rounded-md items-center">
      <p>{label}</p>
      <p>{children || '-'}</p>
    </div>
  )
}
