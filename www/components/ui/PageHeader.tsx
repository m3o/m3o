import type { FC } from 'react'

interface Props {
  title: string
  subTitle: string
}

export const PageHeader: FC<Props> = ({ title, subTitle }) => {
  return (
    <header className="border-b tbc dark:bg-zinc-900">
      <div className="m3o-container py-10 md:py-12">
        <h1 className="font-bold text-black text-3xl dark:text-white md:text-6xl">
          {title}
        </h1>
        <h2 className="mt-4 max-w-lg md:text-xl text-lg text-zinc-500 dark:text-zinc-300 md:leading-9">
          {subTitle}
        </h2>
      </div>
    </header>
  )
}
