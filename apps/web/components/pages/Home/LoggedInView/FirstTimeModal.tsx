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
        If you've signed up to the Free tier you're welcome to try the 
        service for 7 days, no credit card needed. After which you should 
        either top-up your account balance or upgrade to the Solo or Pro 
        subscription plans.
      </p>
      <p className="my-4 dark:text-zinc-400">
        To learn more head to the{' '}
        <Link href="/getting-started">
          <a target="_blank">getting started</a> guide.
        </Link>
      </p>
      <Button onClick={props.closeModal}>Close</Button>
    </Modal>
  )
}
