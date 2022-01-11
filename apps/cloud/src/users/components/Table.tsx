/* eslint react/jsx-key: 0,react/display-name:0 */
import type { FC, ChangeEvent } from 'react'
import type { Account } from 'm3o/user'
import type { Column } from 'react-table'
import format from 'date-fns/format'
import { useMemo } from 'react'
import {
  useTable,
  useFlexLayout,
  useGlobalFilter,
  useAsyncDebounce
} from 'react-table'
import { TableSearch } from '../../components/TableSearch'

interface Props {
  data: Account[]
  tableName: string
  onRowClick: (id: string) => void
}

export const Table: FC<Props> = ({ data, tableName, onRowClick }) => {
  const defaultColumn = useMemo(
    () => ({
      minWidth: 30,
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
      // And also our default editable cell
      Cell: ({ value }: { value: any }) => {
        if (typeof value === 'object') {
          return ''
        }

        return <span title={value}>{value || '-'}</span>
      }
    }),
    []
  )

  const columns = useMemo<Column<Account>[]>(() => {
    return [
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Username',
        accessor: 'username'
      },
      {
        Header: 'ID',
        accessor: 'id'
      },
      {
        Header: 'Created',
        accessor: 'created',
        Cell: ({ value }) => {
          return format(new Date(Number(value) * 1000), 'hh:mm do LLL yy')
        }
      },
      {
        Header: 'Verified',
        accessor: 'verified',
        Cell: ({ value }) => {
          return value ? '✅' : '❌'
        }
      }
    ]
  }, [])

  const tableInstance = useTable(
    { columns, data, defaultColumn },
    useFlexLayout,
    useGlobalFilter
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter
  } = tableInstance

  const onSearchChange = useAsyncDebounce(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      setGlobalFilter(value || undefined)
    },
    200
  )

  return (
    <div className="bg-gray-900 text-white">
      <TableSearch tableName={tableName} onChange={onSearchChange} />
      <div>
        <div {...getTableProps()}>
          <div className="bg-gray-800 font-medium text-sm text-white">
            {headerGroups.map((headerGroup) => (
              <div {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <div
                    {...column.getHeaderProps()}
                    className="text-left p-4 text-sm"
                  >
                    {column.render('Header')}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <div
                  {...row.getRowProps()}
                  className="cursor-pointer hover:bg-gray-800"
                  onClick={() => onRowClick(row.original.id!)}
                >
                  {row.cells.map((cell) => {
                    return (
                      <div
                        {...cell.getCellProps()}
                        className="border-b border-gray-700 p-4 text-sm overflow-hidden overflow-ellipsis whitespace-nowrap"
                      >
                        {cell.render('Cell')}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
