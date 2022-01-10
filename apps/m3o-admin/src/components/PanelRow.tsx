import type { FC } from 'react'

interface Props {
  title: string
  value?: string
}

export const PanelRow: FC<Props> = ({ title, value }) => {
  return (
    <>
      <h2 className="mb-1 text-sm pb-1 font-medium">{title}</h2>
      <p className="mb-6 text-gray-500 text-sm">{value || '-'}</p>
    </>
  )
}
