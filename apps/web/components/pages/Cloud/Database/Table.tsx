import type { Column } from 'react-table'
import { useMemo } from 'react'
import { Table } from '@/components/pages/Cloud'

type DatabaseItem = Record<string, unknown> & { id: string }

interface Props {
  handleDatabaseRowDelete: (items: string[]) => void
  rows: DatabaseItem[]
}

const deDupe = <A extends any[]>(arr: A) => Array.from(new Set(arr))

export function DatabaseTable({ rows, handleDatabaseRowDelete }: Props) {
  const columns = useMemo<Column<DatabaseItem>[]>(() => {
    const keys = deDupe(rows.flatMap(item => Object.keys(item)))

    const cols: Column<DatabaseItem>[] = keys.map(key => ({
      Header: key,
      accessor: key,
    }))

    return cols
  }, [rows])

  return (
    <Table<DatabaseItem>
      data={rows}
      columns={columns}
      onTrashClick={handleDatabaseRowDelete}
      onSetPageSize={console.log}
      statePageSize={20}
    />
  )
}
