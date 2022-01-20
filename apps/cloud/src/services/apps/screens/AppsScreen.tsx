import type { FC } from 'react'
import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/outline'
import { useListApps } from '../hooks/useListApps'
import { Spinner } from '../../../components/Spinner'
import { NoData } from '../../../components/NoData'
import { App } from '../components/App'
import { AppMenu } from '../components/AppMenu'
import { useUpdateApp } from '../hooks/useUpdateApp'
import { useDeleteApp } from '../hooks/useDeleteApp'

export const AppsScreen: FC = () => {
  const [appIdWithOpenMenu, setAppIdWithOpenMenu] = useState('')
  const { apps, isLoading } = useListApps()

  const closeOpenAppMenu = useCallback(() => {
    setAppIdWithOpenMenu('')
  }, [])

  const { deleteApp } = useDeleteApp()

  const { update } = useUpdateApp({
    onSuccess: closeOpenAppMenu
  })

  const toggleMenu = useCallback((id: string) => {
    setAppIdWithOpenMenu((prevId) => (prevId === id ? '' : id))
  }, [])

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
            <AppMenu
              isOpen={app.id === appIdWithOpenMenu}
              handleButtonClick={() => toggleMenu(app.id!)}
              handleClose={closeOpenAppMenu}
              handleUpdateClick={() => update(app.name!)}
              handleDeleteClick={() => handleDelete(app.name!)}
            />
          }
        />
      )),
    [
      apps,
      appIdWithOpenMenu,
      toggleMenu,
      update,
      handleDelete,
      closeOpenAppMenu
    ]
  )

  if (isLoading) {
    return <Spinner />
  }

  return (
    <section className="p-10">
      <header className="flex items-center justify-between">
        <h1 className="font-bold text-4xl">Apps</h1>
        <Link className="btn flex items-center" to="/apps/add">
          <PlusIcon className="w-4 mr-2" />
          Add App
        </Link>
      </header>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-10">
        {renderedApps}
      </div>
    </section>
  )
}
