import type { FC } from 'react'

interface Props {
  title: string
}

export const Section: FC<Props> = ({ children, title }) => {
  return (
    <section className="py-6 md:py-8">
      <div className="m3o-container">
        <h3 className="font-bold text-xl md:text-3xl mb-8 text-black dark:text-white">
          {title}
        </h3>
        <div className="max-w-3xl">{children}</div>
      </div>
    </section>
  )
}
