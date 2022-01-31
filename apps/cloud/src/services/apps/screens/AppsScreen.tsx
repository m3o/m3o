import type { FC } from 'react'
import { useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/outline'
import { useListApps } from '../hooks/useListApps'
import { Spinner } from '../../../components/Spinner'
import { App } from '../components/App'
import { AppMenu } from '../components/AppMenu'
import { useUpdateApp } from '../hooks/useUpdateApp'
import { useDeleteApp } from '../hooks/useDeleteApp'
import { useOnlyOneOpenItem } from '../../../hooks/useOnlyOneOpenItem'
import { NoApps } from '../components/NoApps'
import { AddAppLink } from '../components/AddAppLink'

export const AppsScreen: FC = () => {
  const { toggleItem, isOpen } = useOnlyOneOpenItem()
  const { apps, isLoading } = useListApps()

  const closeOpenAppMenu = useCallback(() => {
    toggleItem('')
  }, [toggleItem])

  const { deleteApp } = useDeleteApp()

  const { update } = useUpdateApp({
    onSuccess: closeOpenAppMenu
  })

  const handleDelete = useCallback(
    (name: string) => {
      if (window.confirm('Are you sure you would like to delete this app?')) {
        closeOpenAppMenu()
        deleteApp(name)
      }
    },
    [deleteApp, closeOpenAppMenu]
  )

  const renderedApps = useMemo(
    () =>
      apps.map((app) => (
        <App
          {...app}
          key={app.id}
          headerRight={
            app.status === 'Deleting' ? null : (
              <AppMenu
                isOpen={isOpen(app.id!)}
                handleButtonClick={() => toggleItem(app.id!)}
                handleClose={closeOpenAppMenu}
                handleUpdateClick={() => update(app.name!)}
                handleDeleteClick={() => handleDelete(app.name!)}
              />
            )
          }
        />
      )),
    [apps, update, handleDelete, closeOpenAppMenu, isOpen, toggleItem]
  )

  if (isLoading) {
    return <Spinner />
  }

  return (
    <section className="p-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-4xl">Apps</h1>
          <p className="mt-2 text-zinc-300">
            For more information on how M3O apps work, please see{' '}
            <a
              href="https://m3o.com/app"
              className="text-indigo-300"
              target="_blank"
              rel="noreferrer"
            >
              M3O.com.
            </a>
          </p>
        </div>
        <AddAppLink />
      </header>
      {apps.length ? (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-10">
          {renderedApps}
        </div>
      ) : (
        <NoApps />
      )}
    </section>
  )
}
