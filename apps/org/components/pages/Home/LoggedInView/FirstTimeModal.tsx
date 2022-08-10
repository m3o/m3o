import type { FC } from 'react'
import type { ModalProps } from '@/components/ui'
import Link from 'next/link'
import { Modal, Button } from '@/components/ui'

export const FirstTimeModal: FC<ModalProps> = props => {
  return (
    <Modal {...props}>
      <h1 className="font-bold text-black text-2xl mb-4 dark:text-white">
        Welcome to M3O!
      </h1>
      <p className="mb-4 dark:text-zinc-400">
        Thanks for signing up, it&apos;s great to have you onboard.
        If you&apos;re not on a subscription the first thing you&apos;ll 
        need to do is go to the{' '}
        <Link href="/account/billing">
          <a target="_blank">Account Billing</a>
        </Link>{' '}
        page and add credit before making any API calls.
      </p>
      <p className="my-4 dark:text-zinc-400">
        To learn more about the platform go to the{' '}
        <Link href="/getting-started">
          <a target="_blank">Getting Started</a> guide.
        </Link>
      </p>
      <Button onClick={props.closeModal}>Close</Button>
    </Modal>
  )
}
