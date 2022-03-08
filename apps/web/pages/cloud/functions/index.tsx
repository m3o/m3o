import type { Func } from 'm3o/function'
import { NextSeo } from 'next-seo'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { DashboardLayout } from '@/components/layouts'
import { Spinner } from '@/components/ui'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { useM3OClient } from '@/hooks'
import { NoServiceResults, Table } from '@/components/pages/Cloud'
import { QueryKeys } from '@/lib/constants'

type FunctionItem = Func & { id: string }

export const getServerSideProps = withAuth(async context => {
  if (!context.req.user) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    }
  }

  return {
    props: {
      user: context.req.user,
    },
  }
})

export default function CloudFunctions() {
  const m3o = useM3OClient()

  const { data, isLoading } = useQuery(
    QueryKeys.CloudFunctions,
    async () => {
      const response = await m3o.function.list({})
      return response.functions || []
    },
    {
      initialData: [],
    },
  )

  console.log(data)

  const columns = useMemo(() => [], [])

  function renderItems() {
    if (isLoading) {
      return <Spinner />
    }

    if (data?.length === 0) {
      return (
        <NoServiceResults
          startLink="/cloud/functions/add"
          serviceName="Functions"
        />
      )
    }

    return (
      <Table<FunctionItem> data={data as FunctionItem[]} columns={columns} />
    )
  }

  return (
    <>
      <NextSeo {...seo.about} />
      <DashboardLayout>
        <div className="p-8">
          <h1 className="text-3xl font-bold">Functions</h1>
        </div>
        {renderItems()}
      </DashboardLayout>
    </>
  )
}
