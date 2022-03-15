import type { Column } from 'react-table'
import type { Func } from 'm3o/function'
import { NextSeo } from 'next-seo'
import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
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
  const queryClient = useQueryClient()
  const m3o = useM3OClient()

  const { data, isFetching } = useQuery(
    QueryKeys.CloudFunctions,
    async () => {
      const response = await m3o.function.list({})
      return response.functions || []
    },
    {
      refetchInterval: 15000,
    },
  )

  const deleteFunctionsMutation = useMutation(
    (items: string[]) => {
      const promises = items
        .map(item => data?.find(func => func.id === item))
        .map(item => m3o.function.delete({ name: item?.name }))

      return Promise.all(promises)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.CloudFunctions)
      },
    },
  )

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

  function handleTrashClick(items: string[]) {
    const message =
      items.length === 1
        ? 'Are you sure you would like to delete this function?'
        : `Are you sure you would like to delete these ${items.length} functions?`

    if (window.confirm(message)) {
      deleteFunctionsMutation.mutate(items)
    }
  }

  function renderItems() {
    if (isFetching) {
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
      <Table<FunctionItem>
        data={data as FunctionItem[]}
        columns={columns}
        onTrashClick={handleTrashClick}
        tableName="functions"
      />
    )
  }

  return (
    <>
      <NextSeo {...seo.cloud.functions.main} />
      <DashboardLayout>
        <div className="px-6 py-4 border-b tbc flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-medium gradient-text">
            Functions
          </h1>
          <LinkButton href="/cloud/functions/add" className="text-sm">
            Add
          </LinkButton>
        </div>
        {renderItems()}
      </DashboardLayout>
    </>
  )
}
