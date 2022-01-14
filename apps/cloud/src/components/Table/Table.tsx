import type { Column, CellProps } from 'react-table'
import type { ChangeEvent } from 'react'
import { useMemo, useState, useCallback } from 'react'
import {
  useTable,
  useFlexLayout,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination
} from 'react-table'
import { Pagination } from './Pagination'
import { ActionsBar } from './ActionsBar'
import { TableSearch } from './TableSearch'
import { Checkbox } from '../Checkbox'

interface ExpectedObject extends Record<string, unknown> {
  id: string
}

interface Props<T extends ExpectedObject> {
  columns: Column<T>[]
  data: T[]
  onDeleteMultiple: (items: T[]) => void
}

export function Table<T extends ExpectedObject>({
  columns,
  data,
  onDeleteMultiple
}: Props<T>) {
  const [checkedItems, setCheckedItems] = useState<T[]>([])

  const onRowCheck = useCallback((item: T) => {
    setCheckedItems((prevItems) => {
      const jsonItem = JSON.stringify(item)
      const found = prevItems.some(
        (prevItem) => JSON.stringify(prevItem) === jsonItem
      )

      if (found) {
        return prevItems.filter(
          (prevItem) => JSON.stringify(prevItem) !== jsonItem
        )
      }

      return [...prevItems, item]
    })
  }, [])

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

  const columnsWithCheckboxes = useMemo(
    () => [
      {
        id: 'checkbox',
        width: 50,
        Cell: ({ row }: CellProps<T>) => (
          <Checkbox
            id={row.original.id!}
            onChange={() => onRowCheck(row.original)}
          />
        )
      },
      ...columns
    ],
    [columns, onRowCheck]
  )

  const tableInstance = useTable(
    { columns: columnsWithCheckboxes, data, defaultColumn },
    useFlexLayout,
    useGlobalFilter,
    usePagination
  )

  const {
    canNextPage,
    canPreviousPage,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    previousPage,
    setGlobalFilter,
    pageCount,
    setPageSize,
    pageOptions,
    nextPage,
    state: { pageIndex, pageSize }
  } = tableInstance

  const onSearchChange = useAsyncDebounce(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      setGlobalFilter(value || undefined)
    },
    200
  )

  return (
    <div className="text-white">
      <ActionsBar
        hasCheckedItems={!!checkedItems.length}
        right={<TableSearch tableName="users" onChange={onSearchChange} />}
        onDeleteClick={() => onDeleteMultiple(checkedItems)}
        onPageSizeChange={(event) => {
          setPageSize(Number(event.target.value))
        }}
      />
      <div>
        <div {...getTableProps()}>
          <div className="bg-gray-800 font-medium text-sm text-white">
            {headerGroups.map((headerGroup) => (
              <div {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <div
                    {...column.getHeaderProps()}
                    className="text-left p-2 text-sm"
                  >
                    {column.render('Header')}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <div
                  {...row.getRowProps()}
                  className="cursor-pointer hover:bg-gray-800 group"
                >
                  {row.cells.map((cell) => {
                    return (
                      <div
                        {...cell.getCellProps()}
                        className="border-b border-gray-700 p-2 text-sm overflow-hidden overflow-ellipsis whitespace-nowrap"
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
        <Pagination
          gotoPage={gotoPage}
          canNextPage={canNextPage}
          canPreviousPage={canPreviousPage}
          previousPage={previousPage}
          pageCount={pageCount}
          pageOptions={pageOptions}
          nextPage={nextPage}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </div>
    </div>
  )
}
