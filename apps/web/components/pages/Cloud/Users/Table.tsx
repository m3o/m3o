import type { Account } from 'm3o/user'
import type { Column } from 'react-table'

import format from 'date-fns/format'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { Table } from '@/components/pages/Cloud'

type UserAccount = Required<Account>

interface Props {
  users: UserAccount[]
}

export function UsersTable({ users }: Props) {
  const router = useRouter()

  const columns = useMemo<Column<UserAccount>[]>(() => {
    return [
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Username',
        accessor: 'username',
      },
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Created',
        accessor: 'created',
        Cell: ({ value }) => {
          return format(new Date(Number(value) * 1000), 'PPpp')
        },
      },
      {
        Header: 'Verified',
        accessor: 'verified',
        Cell: ({ value }) => {
          return value ? 'true' : 'false'
        },
      },
    ]
  }, [])

  return (
    <Table<UserAccount>
      data={users}
      columns={columns}
      onTrashClick={console.log}
      onSetPageSize={console.log}
      statePageSize={20}
      rowClickPath="/users"
    />
  )
}
