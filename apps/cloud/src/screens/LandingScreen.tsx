import type { FC } from 'react'
import { UserIcon, DatabaseIcon, TerminalIcon } from '@heroicons/react/outline'
import { ApiBox } from '../components/ApiBox'

export const LandingScreen: FC = () => {
  return (
    <section className="p-14 text-white">
      <h1 className="text-5xl font-bold mb-4">Welcome to M3O Cloud</h1>
      <p className="text-xl max-w-xl text-gray-400">
        Manage your content on M3O with M3O Cloud!
      </p>
      <div className="mt-10 grid grid-cols-3 gap-4">
        <ApiBox
          title="Apps"
          subTitle="Upload and manage your apps"
          icon={TerminalIcon}
          linkTo="/apps"
        />
        <ApiBox
          title="Users"
          subTitle="Manage your users"
          icon={UserIcon}
          linkTo="/users"
        />
        <ApiBox
          title="DB"
          subTitle="Manage your data"
          icon={DatabaseIcon}
          linkTo="/database"
        />
      </div>
    </section>
  )
}
