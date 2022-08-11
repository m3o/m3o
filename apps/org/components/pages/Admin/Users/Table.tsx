import type { Account } from 'm3o/user'
import type { Column } from 'react-table'
import Link from 'next/link'
import format from 'date-fns/format'
import { useMemo } from 'react'
import { Table } from '@/components/pages/Admin'

type UserAccount = Required<Account>

interface Props {
  handleUserDeleteClick: (items: string[]) => void
  users: UserAccount[]
}

export function UsersTable({ users, handleUserDeleteClick }: Props) {
  const columns = useMemo<Column<UserAccount>[]>(() => {
    return [
      {
        Header: 'Email',
        accessor: 'email',
        Cell: ({ row, value }) => (
          <Link href={`/cloud/users/${row.original.id}`}>{value}</Link>
        ),
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
      onTrashClick={handleUserDeleteClick}
      onSetPageSize={console.log}
      statePageSize={20}
      tableName="users"
    />
  )
}
