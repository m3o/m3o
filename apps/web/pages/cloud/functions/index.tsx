import type { Column } from 'react-table'
import type { Func } from 'm3o/function'
import { NextSeo } from 'next-seo'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { DashboardLayout } from '@/components/layouts'
import { FullSpinner, LinkButton } from '@/components/ui'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { useM3OClient } from '@/hooks'
import { NoServiceResults, Table } from '@/components/pages/Cloud'
import { QueryKeys } from '@/lib/constants'

type FunctionItem = Required<Func> & { id: string }

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

  const { data, isLoading } = useQuery(QueryKeys.CloudFunctions, async () => {
    const response = await m3o.function.list({})
    return response.functions || []
  })

  const columns = useMemo<Column<FunctionItem>[]>(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'URL',
        accessor: 'url',
        Cell: ({ value }) => <a href={value}>{value}</a>,
      },
      {
        Header: 'Branch',
        accessor: 'branch',
      },
      {
        Header: 'Repo',
        accessor: 'repo',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Sub Folder',
        accessor: 'subfolder',
      },
      {
        Header: 'Runtime',
        accessor: 'runtime',
      },
    ],
    [],
  )

  function renderItems() {
    if (isLoading) {
      return <FullSpinner />
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

  console.log(data)

  return (
    <>
      <NextSeo {...seo.about} />
      <DashboardLayout>
        <div className="p-6 border-b tbc flex items-center justify-between">
          <h1 className="text-3xl font-medium gradient-text">Functions</h1>
          <LinkButton href="/cloud/functions/add" className="text-sm">
            Add
          </LinkButton>
        </div>
        {renderItems()}
      </DashboardLayout>
    </>
  )
}
