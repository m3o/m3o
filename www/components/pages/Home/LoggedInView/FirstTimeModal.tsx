import type { FC } from 'react'
import type { ModalProps } from '@/components/ui'
import Link from 'next/link'
import { Modal, Button } from '@/components/ui'

export const FirstTimeModal: FC<ModalProps> = props => {
  return (
    <Modal {...props}>
      <h1 className="font-bold text-black text-2xl mb-4 dark:text-white">
        Welcome to M3O
      </h1>
      <p className="mb-4 dark:text-zinc-400">
        Firstly, thanks for joining, it&apos;s great to have you onboard.
      </p>
      <p className="mb-4 dark:text-zinc-400">
        Our goal is simple... Provide you with the tools you need to get your
        app off the ground. We provide easy to use building blocks that allow
        for rapid API development.
      </p>
      <p className="dark:text-zinc-400">
        Simply install our package, pick an API, add your API key and
        you&apos;re good to go. No more managing servers and buckets (hint,
        hint), just scale in seconds.
      </p>
      <h3 className="font-medium my-4 text-black dark:text-white">
        Surely it&apos;s not that simple?
      </h3>
      <p className="dark:text-zinc-400">
        Actually, it is... but for a more in depth guide please see our{' '}
        <Link href="/getting-started">
          <a target="_blank">getting started guide</a>
        </Link>
      </p>
      <p className="my-4 dark:text-zinc-400">
        TLDR; use our API&apos;s to rapidly develop your application
      </p>
      <Button onClick={() => props.closeModal()}>Got it, thanks</Button>
    </Modal>
  )
}
