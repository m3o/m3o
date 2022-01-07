/* eslint react/jsx-key: 0,react/display-name:0 */
import type { FC, ChangeEvent } from 'react'
import type { Column, CellProps } from 'react-table'
import { v4 } from 'uuid'
import { useMemo, useState, useCallback } from 'react'
import {
  useTable,
  useFlexLayout,
  useGlobalFilter,
  useAsyncDebounce
} from 'react-table'
import { deDupe } from '../utils'
import { TableSearch } from './TableSearch'
import { ActionsMenu } from './ActionsMenu'

interface DatabaseItem {
  id: string
  [key: string]: unknown
}

interface Props {
  data: DatabaseItem[]
  tableName: string
  onRowDelete: (id: string) => void
}

export const Table: FC<Props> = ({ data, tableName, onRowDelete }) => {
  const [openActionMenuId, setOpenActionMenuId] = useState('')

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

  const toggleActionMenu = useCallback((id: string) => {
    setOpenActionMenuId((prevId) => (prevId === id ? '' : id))
  }, [])

  const columns = useMemo<Column<DatabaseItem>[]>(() => {
    const keys = deDupe(data.flatMap((item) => Object.keys(item)))

    const cols: Column<DatabaseItem>[] = keys.map((key) => ({
      Header: key,
      accessor: key
    }))

    cols.push({
      Header: '',
      id: v4(),
      width: 50,
      Cell: (props: CellProps<DatabaseItem>) => {
        const { id } = props.row.original

        return (
          <ActionsMenu
            onButtonClick={() => toggleActionMenu(id)}
            isOpen={id === openActionMenuId}
            onDeleteClick={() => onRowDelete(id)}
          />
        )
      }
    })

    return cols
  }, [data, toggleActionMenu, openActionMenuId, onRowDelete])

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
                          i % 2 == 0 ? 'bg-gray-50' : ''
                        } text-sm overflow-hidden overflow-ellipsis`}
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
