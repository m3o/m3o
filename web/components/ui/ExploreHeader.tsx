import type { FC } from 'react'

interface Props {
  title: string
  subTitle?: string
}

export const ExploreHeader: FC<Props> = ({ title }: Props) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-5xl mb-2 pb-4 font-bold">
          {title}
        </h1>
      </div>
    </div>
  )
}
