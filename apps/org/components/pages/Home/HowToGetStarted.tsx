import type { FC } from 'react'
import { CodeExample } from './CodeExample/CodeExample'
import { DescriptionHeading } from './DescriptionHeading'
import { GradientHeading } from '../../ui/GradientHeading'

export const HowToGetStarted: FC = () => {
  return (
    <section className="bg-white py-20 dark:bg-zinc-800">
      <div className="m3o-container sm p-16 text-center">
        <DescriptionHeading>How to integrate?</DescriptionHeading>
        <h4 className="text-4xl my-4 pb-2 text-white font-bold">
          Let&apos;s get started...
        </h4>
        <h5 className="mt-2 max-w-xl mx-auto text-lg text-zinc-600 dark:text-zinc-300">
          Each API comes with ready to use code examples and pre-generated
          client libraries for easy integration.
        </h5>
        {process.browser && <CodeExample />}
      </div>
    </section>
  )
}
