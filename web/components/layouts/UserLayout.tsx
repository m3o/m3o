import type { FC } from 'react'
import { Header } from '@/components/ui'

interface Props {
  title: string
  subTitle: string
}

export const UserLayout: FC<Props> = ({ children, subTitle, title }) => {
  return (
    <>
      <Header />
      <section className="py-10 text-black dark:border-zinc-700 border-b border-zinc-300">
        <div className="m3o-container">
          <h1 className="text-3xl font-bold dark:text-white md:text-4xl">
            {title}
          </h1>
          <h2 className="text-zinc-700 mt-2 dark:text-zinc-400">{subTitle}</h2>
        </div>
      </section>
      <section className="bg-zinc-50 py-6 dark:bg-zinc-900">
        <div className="m3o-container">{children}</div>
      </section>
    </>
  )
}
