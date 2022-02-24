import type { FC } from 'react'
import { SellingPoint } from './SellingPoint'
import { SELLING_POINTS } from './SellingPoints.content'

export const SellingPoints: FC = () => {
  return (
    <section className="py-8 md:py-16 border-b  dark:border-zinc-700 relative  bg-zinc-50 dark:bg-zinc-800">
      <div className="m3o-container">
        <h1 className="font-bold text-2xl md:text-3xl text-center mb-8 dark:text-white text-black">
          Developer friendly UX
        </h1>
        <div className="md:grid md:grid-cols-4 w-full md:gap-4">
          {SELLING_POINTS.map(item => (
            <SellingPoint key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
