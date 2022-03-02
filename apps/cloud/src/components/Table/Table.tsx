import type { Column, CellProps } from 'react-table'
import type { ChangeEvent } from 'react'
import { useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { useSelectItems } from '../../hooks/useSelectItems'

interface ExpectedObject extends Record<string, unknown> {
  id: string
}

interface Props<T extends ExpectedObject> {
  columns: Column<T>[]
  data: T[]
  onTrashClick: (items: string[]) => void
  onSetPageSize?: (pageSize: number) => void
  statePageSize?: number
  rowClickPath: string
}

export function Table<T extends ExpectedObject>({
  columns,
  data,
  onTrashClick,
  onSetPageSize,
  statePageSize,
  rowClickPath
}: Props<T>) {
  const navigate = useNavigate()
  const [shouldSelectAll, setShouldSelectAll] = useState(false)
  const { onSelectItem, selectedItems, resetSelectedItems } =
    useSelectItems<T>()

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
          <div className="pl-4 relative z-20">
            <Checkbox
              checked={
                shouldSelectAll ||
                selectedItems.some(
                  (item) =>
                    JSON.stringify(item) === JSON.stringify(row.original)
                )
              }
              id={row.original.id!}
              onChange={() => onSelectItem(row.original)}
            />
          </div>
        ),
        Header: () => (
          <div className="pl-4">
            <Checkbox
              checked={shouldSelectAll}
              id="select-all"
              onChange={() => {
                const newValue = !shouldSelectAll
                setShouldSelectAll(newValue)

                if (!newValue) {
                  resetSelectedItems()
                }
              }}
            />
          </div>
        )
      },
      ...columns
    ],
    [columns, onSelectItem, selectedItems, shouldSelectAll]
  )

  const tableInstance = useTable(
    {
      columns: columnsWithCheckboxes,
      data,
      defaultColumn,
      initialState: { pageSize: statePageSize || 20 }
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

  const handleDeleteClick = useCallback(() => {
    const items: string[] = shouldSelectAll
      ? page.map(({ original }) => original.id)
      : selectedItems.map(({ id }) => id)

    onTrashClick(items)
  }, [shouldSelectAll, selectedItems, page])

  return (
    <div className="text-white">
      <ActionsBar
        hasCheckedItems={!!selectedItems.length || shouldSelectAll}
        right={<TableSearch tableName="users" onChange={onSearchChange} />}
        onDeleteClick={handleDeleteClick}
        pageSize={pageSize}
        showingResults={`${data.length} results`}
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
            {page.map((row) => {
              prepareRow(row)
              return (
                <div
                  {...row.getRowProps()}
                  className="hover:bg-zinc-800 group h-10 cursor-pointer"
                >
                  {row.cells.map((cell, idx) => {
                    return (
                      <div
                        {...cell.getCellProps()}
                        onClick={
                          !idx
                            ? undefined
                            : () =>
                                navigate(`${rowClickPath}/${row.original.id}`)
                        }
                        className="border-b border-zinc-700 p-2 text-sm flex items-center"
                      >
                        <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                          {cell.render('Cell')}
                        </span>
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
