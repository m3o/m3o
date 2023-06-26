import type { NextPage } from 'next'
import { useState } from 'react'
import { NextSeo } from 'next-seo'
import { Routes } from '@/lib/constants'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import {
  KeysApiUsage,
  PersonalToken,
  ApiKeys,
  DeleteKeyConfirmationModal,
  CreateAPIKeyModal,
} from '@/components/pages/User'
import seo from '@/lib/seo.json'

interface KeysProps {
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

const Keys: NextPage<KeysProps> = () => {
  const [deleteKeyId, setDeleteKeyId] = useState('')
  const [showAddKeyModal, setShowAddKeyModal] = useState(false)

  return (
    <>
      <NextSeo title={seo.account.keys.title} />
      <DashboardLayout>
        <div className="p-6 md:p-10">
          <h1 className="text-3xl mb-6 pb-4 font-medium">
            Tokens
          </h1>
          <PersonalToken />
          <ApiKeys
            onDeleteClick={setDeleteKeyId}
            onAddClick={() => setShowAddKeyModal(true)}
          />
          {showAddKeyModal && (
            <CreateAPIKeyModal
              open={showAddKeyModal}
              closeModal={() => setShowAddKeyModal(false)}
            />
          )}
          <DeleteKeyConfirmationModal
            deleteKeyId={deleteKeyId}
            open={!!deleteKeyId}
            closeModal={() => setDeleteKeyId('')}
          />
        </div>
      </DashboardLayout>
    </>
  )
}

export default Keys
