import type { FC } from 'react'
import { Card } from '@/components/ui'

export const Licenses: FC = () => {
  return (
    <>
      <Card className="mb-4 p-4 md:p-6">
        <h3 className="font-bold text-black text-lg mb-6 dark:text-white">
          Source
        </h3>
        <p className="mb-2">
          <a
            href="https://github.com/micro/services"
            target="_blank"
            rel="noreferrer">
            Github
          </a>
        </p>
      </Card>
      <Card className="mb-4 p-4 md:p-6">
        <h3 className="font-bold text-black text-lg mb-6 dark:text-white">
          Licence
        </h3>
        <p>
          <a
            href="https://www.apache.org/licenses/LICENSE-2.0"
            target="_blank"
            rel="noreferrer">
            Apache 2.0
          </a>
        </p>
      </Card>
      <Card className="p-4 md:p-6">
        <h3 className="font-bold text-black text-lg mb-6 dark:text-white">
          Issues
        </h3>
        <p>
          <a
            href="https://github.com/m3o/m3o/issues/new/choose"
            target="_blank"
            rel="noreferrer">
            Log on Github
          </a>
        </p>
      </Card>
    </>
  )
}
