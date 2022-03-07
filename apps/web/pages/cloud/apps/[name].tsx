import type { ReactElement } from 'react'
import { useForm } from 'react-hook-form'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { BackButtonLink, Spinner } from '@/components/ui'
import { useFetchSingleApp } from '@/hooks'

interface Props {
  user: Account
}

export const getServerSideProps = withAuth(async ({ req }) => {
  if (!req.user) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    }
  }

  return {
    props: {
      user: req.user,
    } as Props,
  }
})

export default function CloudApp(): ReactElement {
  const {} = useForm()
  const router = useRouter()
  const { data, isLoading } = useFetchSingleApp(router.query.name as string)

  function renderApp() {
    return (
      <div>
        <h1 className="font-bold text-3xl mb-2">{data!.name}</h1>
        <p>
          <a href={data!.url} className="flex">
            {data!.url} <ExternalLinkIcon className="w-4 ml-1" />
          </a>
        </p>
        <div className="mt-10">
          <h2 className="font-bold">Overview</h2>
          <table>
            <thead></thead>
          </table>
          <h2 className="font-bold mt-10">Environment Variables</h2>
          <table>
            <thead></thead>
          </table>
        </div>
      </div>
    )
  }

  return (
    <>
      <NextSeo {...seo.about} />
      <DashboardLayout>
        <div className="p-6 md:p-10">
          <BackButtonLink href="/cloud/apps">Back to apps</BackButtonLink>
          {isLoading ? <Spinner /> : renderApp()}
        </div>
      </DashboardLayout>
    </>
  )
}
