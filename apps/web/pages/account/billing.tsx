import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useState } from 'react'
import Link from 'next/link'
import { Routes } from '@/lib/constants'
import { ChevronRightIcon } from '@heroicons/react/outline'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import { Modal, Button, SubscriptionPlanBubble } from '@/components/ui'
import {
  AddFunds,
  PaymentMethods,
  DeleteCardModal,
  History,
} from '@/components/pages/User'
import { BillingProvider } from '@/providers'
import seo from '@/lib/seo.json'
import { useBillingAccount, useDowngradeToFreeTier } from '@/hooks'
import { SubscriptionPlans } from '@/lib/constants'

interface Props {
  user: Account
}

export const getServerSideProps = withAuth(async context => {
  if (!context.req.user) {
    return {
      redirect: {
        destination: Routes.Home,
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: context.req.user,
    },
  }
})

const Billing: NextPage<Props> = ({ user }) => {
  const [showCancelSubscriptionModal, setShowSubscriptionModal] =
    useState(false)
  const { subscriptionLevel } = useBillingAccount()
  const { downgrade, isLoading } = useDowngradeToFreeTier({
    onSuccess: () => {
      setShowSubscriptionModal(false)
    },
  })

  return (
    <>
      <NextSeo title={seo.account.billing.title} />
      <BillingProvider user={user}>
        <DashboardLayout>
          <h1 className="gradient-text text-3xl md:text-5xl mb-6 pb-4 font-bold">
            Billing &amp; Plans
          </h1>
          <div className="mt-8 tbgc p-6 md:p-10 rounded-lg">
            <h3 className="font-bold text-2xl text-black mb-3 dark:text-white">
              Subscription Plan
            </h3>
            <p className="ttc">
              You are currently on the{' '}
              {subscriptionLevel && (
                <SubscriptionPlanBubble plan={subscriptionLevel} />
              )}{' '}
              plan
            </p>

            {subscriptionLevel !== SubscriptionPlans.Free && (
              <div className="mt-4 font-light">
                <button
                  className="bg-zinc-200 dark:bg-zinc-700 py-2 px-4 rounded-full text-sm flex items-center"
                  onClick={() => setShowSubscriptionModal(true)}>
                  Cancel subscription <ChevronRightIcon className="w-4 ml-2" />
                </button>
              </div>
            )}
            {subscriptionLevel === SubscriptionPlans.Free && (
              <div className="mt-4 font-light">
                <Link href="/subscriptions/pro/card-details">
                  <a className="bg-zinc-200 dark:bg-zinc-700 py-2 px-4 rounded-full text-sm inline-flex items-center">
                    Upgrade to Pro <ChevronRightIcon className="w-4 ml-2" />
                  </a>
                </Link>
              </div>
            )}
          </div>
          <AddFunds />
          <PaymentMethods />
          <History />
          <DeleteCardModal />
          <Modal
            open={showCancelSubscriptionModal}
            closeModal={() => setShowSubscriptionModal(false)}>
            <p className="pr-6">
              Are you sure you would like to cancel your subscription?
            </p>
            <Button
              loading={isLoading}
              onClick={() => downgrade()}
              className="mt-6">
              Confirm
            </Button>
          </Modal>
        </DashboardLayout>
      </BillingProvider>
    </>
  )
}

export default Billing
