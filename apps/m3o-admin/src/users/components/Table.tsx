/* eslint react/jsx-key: 0,react/display-name:0 */
import type { FC, ChangeEvent } from 'react'
import type { Account } from 'm3o/user'
import type { Column, CellProps } from 'react-table'
import { ArrowRightIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'
import format from 'date-fns/format'
import { useMemo, useState } from 'react'
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
  onRowDelete: (id: string) => void
}

export const Table: FC<Props> = ({ data, tableName, onRowDelete }) => {
  const [setOpenActionMenuId] = useState('')

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
      },
      {
        Header: '',
        width: 75,
        id: 'actions-column',
        Cell: ({
          row: {
            original: { id }
          }
        }: CellProps<Account>) => {
          return (
            <Link
              to={`/users/${id}`}
              className="flex items-center bg-indigo-600 py-2 px-4 rounded-md text-white text-sm hover:bg-indigo-900 transition-colors"
            >
              View <ArrowRightIcon className="w-4 ml-2" />
            </Link>
          )
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
    <>
      <TableSearch tableName={tableName} onChange={onSearchChange} />
      <div className="p-4 pt-2">
        <div {...getTableProps()}>
          <div className="bg-gray-50 mb-4 rounded-md font-medium text-sm">
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
                <div {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <div
                        {...cell.getCellProps()}
                        className={`p-4 ${
                          i % 2 === 0 ? 'bg-gray-50' : ''
                        } text-sm overflow-hidden overflow-ellipsis flex items-center`}
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
    </>
  )
}
