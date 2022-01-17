import type { Column, CellProps } from 'react-table'
import type { ChangeEvent } from 'react'
import { useMemo } from 'react'
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
  onDeleteMultiple: VoidFunction
  selectedItems: T[]
  setSelectedItems: (item: T) => void
  onSetPageSize?: (pageSize: number) => void
  statePageSize?: number
}

export function Table<T extends ExpectedObject>({
  columns,
  data,
  onDeleteMultiple,
  selectedItems,
  setSelectedItems,
  onSetPageSize,
  statePageSize
}: Props<T>) {
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
            checked={selectedItems.some(
              (item) => JSON.stringify(item) === JSON.stringify(row.original)
            )}
            id={row.original.id!}
            onChange={() => setSelectedItems(row.original)}
          />
        )
      },
      ...columns
    ],
    [columns, setSelectedItems, selectedItems]
  )

  const tableInstance = useTable(
    {
      columns: columnsWithCheckboxes,
      data,
      defaultColumn,
      initialState: { pageSize: statePageSize || 10 }
    },
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
        hasCheckedItems={!!selectedItems.length}
        right={<TableSearch tableName="users" onChange={onSearchChange} />}
        onDeleteClick={onDeleteMultiple}
        pageSize={pageSize}
        onPageSizeChange={(event) => {
          const newPageSize = Number(event.target.value)

          setPageSize(Number(event.target.value))

          if (onSetPageSize) {
            onSetPageSize(newPageSize)
          }
        }}
      />
      <div>
        <div {...getTableProps()}>
          <div className="bg-zinc-800 font-medium text-sm text-white">
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
                <div {...row.getRowProps()} className="hover:bg-zinc-800 group">
                  {row.cells.map((cell) => {
                    return (
                      <div
                        {...cell.getCellProps()}
                        className="border-b border-zinc-700 p-2 text-sm overflow-hidden overflow-ellipsis whitespace-nowrap"
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
