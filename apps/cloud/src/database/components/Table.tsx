/* eslint react/jsx-key: 0,react/display-name:0 */
import type { FC, ChangeEvent } from 'react'
import type { Column } from 'react-table'
import { useMemo } from 'react'
import {
  useTable,
  useFlexLayout,
  useGlobalFilter,
  useAsyncDebounce
} from 'react-table'
import { deDupe } from '../../utils'
import { TableSearch } from '../../components/TableSearch'

interface DatabaseItem {
  id: string
  [key: string]: unknown
}

interface Props {
  data: DatabaseItem[]
  tableName: string
  onRowClick: (id: string) => void
}

export const Table: FC<Props> = ({ data, tableName, onRowClick }) => {
  const defaultColumn = useMemo(
    () => ({
      minWidth: 10,
      // width: 150, // width is used for both the flex-basis and flex-grow
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

  const columns = useMemo<Column<DatabaseItem>[]>(() => {
    const keys = deDupe(data.flatMap((item) => Object.keys(item)))

    const cols: Column<DatabaseItem>[] = keys.map((key) => ({
      Header: key,
      accessor: key
    }))

    return cols
  }, [data])

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
      <div className="overflow-x-scroll">
        <div {...getTableProps()}>
          <div className="font-medium text-sm text-white">
            {headerGroups.map((headerGroup) => (
              <div {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <div
                    {...column.getHeaderProps()}
                    className="text-left p-4 text-sm bg-gray-800 border-b border-gray-700"
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
                  onClick={() => onRowClick(row.original.id)}
                  className="cursor-pointer hover:bg-gray-800"
                >
                  {row.cells.map((cell) => {
                    return (
                      <div
                        {...cell.getCellProps()}
                        className="p-4 text-sm overflow-hidden overflow-ellipsis whitespace-nowrap border-b border-gray-800 font-light text-white"
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
