import type { FC } from 'react'
import { useMemo, useCallback } from 'react'

import { useListFunctions } from '../hooks/useListFunctions'
import { Spinner } from '../../../components/Spinner'
import { Function } from '../components/Function'
import { FunctionMenu } from '../components/FunctionMenu'
import { useUpdateFunction } from '../hooks/useUpdateFunction'
import { useDeleteFunction } from '../hooks/useDeleteFunction'
import { useOnlyOneOpenItem } from '../../../hooks/useOnlyOneOpenItem'
import { NoFunctions } from '../components/NoFunctions'
import { AddFunctionLink } from '../components/AddFunctionLink'

export const FunctionsScreen: FC = () => {
  const { toggleItem, isOpen } = useOnlyOneOpenItem()
  const { functions, isLoading } = useListFunctions()

  const closeOpenFunctionMenu = useCallback(() => {
    toggleItem('')
  }, [toggleItem])

  const { deleteFunction } = useDeleteFunction()

  const { update } = useUpdateFunction({
    onSuccess: closeOpenFunctionMenu
  })

  const handleDelete = useCallback(
    (name: string) => {
      if (window.confirm('Are you sure you would like to delete this function?')) {
        closeOpenFunctionMenu()
        deleteFunction(name)
      }
    },
    [deleteFunction, closeOpenFunctionMenu]
  )

  const renderedFunctions = useMemo(
    () =>
      functions.map((func) => (
        <Function
          {...func}
          key={func.id}
          headerRight={
            func.status === 'Deleting' ? null : (
              <FunctionMenu
                isOpen={isOpen(func.id!)}
                handleButtonClick={() => toggleItem(func.id!)}
                handleClose={closeOpenFunctionMenu}
                handleUpdateClick={() => update(func.name!)}
                handleDeleteClick={() => handleDelete(func.name!)}
              />
            )
          }
        />
      )),
    [functions, update, handleDelete, closeOpenFunctionMenu, isOpen, toggleItem]
  )

  if (isLoading) {
    return <Spinner />
  }

  return (
    <section className="p-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-4xl">Functions</h1>
          <p className="mt-2 text-zinc-300">
            For more information on how M3O functions work, please see{' '}
            <a
              href="https://m3o.com/function"
              className="text-indigo-300"
              target="_blank"
              rel="noreferrer"
            >
              M3O.com.
            </a>
          </p>
        </div>
        <AddFunctionLink />
      </header>
      {functions.length ? (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-10">
          {renderedFunctions}
        </div>
      ) : (
        <NoFunctions />
      )}
    </section>
  )
}
