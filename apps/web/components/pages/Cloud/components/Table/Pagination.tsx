import type { FC } from 'react'
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/outline'

interface Props {
  canNextPage: boolean
  canPreviousPage: boolean
  gotoPage: (pageIndex: number) => void
  nextPage: VoidFunction
  pageCount: number
  previousPage: VoidFunction
  pageIndex: number
  pageOptions: number[]
  pageSize: number
}

export const Pagination: FC<Props> = ({
  canNextPage,
  canPreviousPage,
  gotoPage,
  nextPage,
  previousPage,
  pageOptions,
  pageIndex,
  pageCount
}) => {
  return (
    <div className="flex items-center p-2 justify-end mt-2">
      <button
        onClick={() => gotoPage(0)}
        disabled={!canPreviousPage}
        className="circle-btn"
      >
        <ChevronDoubleLeftIcon className="w-4" />
      </button>
      <button
        onClick={() => previousPage()}
        disabled={!canPreviousPage}
        className="circle-btn ml-2"
      >
        <ChevronLeftIcon className="w-4" />
      </button>
      <p className="px-2">
        {pageIndex + 1} of {pageOptions.length}
      </p>
      <button
        onClick={() => nextPage()}
        disabled={!canNextPage}
        className="circle-btn mr-2"
      >
        <ChevronRightIcon className="w-4" />
      </button>
      <button
        onClick={() => gotoPage(pageCount - 1)}
        disabled={!canNextPage}
        className="circle-btn mr-2"
      >
        <ChevronDoubleRightIcon className="w-4" />
      </button>
    </div>
  )
}
