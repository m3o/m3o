import { NextSeo } from 'next-seo'
import seo from '@/lib/seo.json'
import { Routes } from '@/lib/constants'
import { DashboardLayout } from '@/components/layouts'
import { WithAuthProps, withAuth } from '@/lib/api/m3o/withAuth'
import type { NextPage } from 'next'
import Link from 'next/link'
import {
  CodeIcon,
  CloudIcon,
  UserGroupIcon,
  DatabaseIcon,
  UsersIcon,
  TerminalIcon,
} from '@heroicons/react/outline'


export const getServerSideProps = withAuth(async context => {
  if (!context.req.user) {
    return {
      redirect: {
        destination: Routes.Home,
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: context.req.user,
    },
  }
})

const AdminPage: NextPage<WithAuthProps> = ({
  user
}) => {
  return (
    <>
      <NextSeo
        title={seo.cloud.title}
        description={seo.cloud.description}
        canonical="https://m3o.com/admin"
      />
      <DashboardLayout>
      <section className="px-4 md:px-0 py-12 md:py-24 text-zinc-600 dark:text-zinc-400">
        <div className="md:max-w-4xl lg:max-w-7xl mx-auto w-11/12 mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-6 max-w-2xl dark:text-white font-bold">
            Admin
          </h1>
          <h2 className="text-md md:text-lg lg:text-xl max-w-3xl">
            M3O Cloud Admin
          </h2>
        </div>
        <div className="md:max-w-4xl lg:max-w-7xl mx-auto w-11/12 mb-10">
          <div className="md:grid md:grid-cols-2 lg:grid-cols-2 md:gap-6">
	    <div className="mb-6 md:mb-0 text-left relative card hover:shadow-lg transition-shadow tbc">
	      <Link href={`/admin/apps`}>
		<a className="absolute top-0 left-0 w-full h-full z-30"></a>
	      </Link>
	      <div className="relative z-40 pointer-events-none p-6 pb-0 md:pb-0">
		<div className="flex items-center justify-between mb-3">
		  <TerminalIcon className="w-5 text-indigo-600 dark:text-pink-400" />
		</div>
		<h3 className="mt-0 text-2xl mb-1">
		  <Link href={`/admin/apps`}>
		    <a
		      data-testid={`service-link-apps`}
		      className="font-bold text-zinc-900 pointer-events-auto dark:text-white">
		      Apps
		    </a>
		  </Link>
		</h3>
		<p className="truncate text-zinc-500 dark:text-zinc-300 mb-6">
		  Serverless app deployment
		</p>
	      </div>
	    </div>
	    <div className="mb-6 md:mb-0 text-left relative card hover:shadow-lg transition-shadow tbc">
	      <Link href={`/admin/functions`}>
		<a className="absolute top-0 left-0 w-full h-full z-30"></a>
	      </Link>
	      <div className="relative z-40 pointer-events-none p-6 pb-0 md:pb-0">
		<div className="flex items-center justify-between mb-3">
		  <CodeIcon className="w-5 text-indigo-600 dark:text-pink-400" />
		</div>
		<h3 className="mt-0 text-2xl mb-1">
		  <Link href={`/admin/functions`}>
		    <a
		      data-testid={`service-link-functions`}
		      className="font-bold text-zinc-900 pointer-events-auto dark:text-white">
		      Functions
		    </a>
		  </Link>
		</h3>
		<p className="truncate text-zinc-500 dark:text-zinc-300 mb-6">
		  Serverless lambda functions
		</p>
	      </div>
	    </div>
	    <div className="mb-6 md:mb-0 text-left relative card hover:shadow-lg transition-shadow tbc">
	      <Link href={`/admin/database`}>
		<a className="absolute top-0 left-0 w-full h-full z-30"></a>
	      </Link>
	      <div className="relative z-40 pointer-events-none p-6 pb-0 md:pb-0">
		<div className="flex items-center justify-between mb-3">
		  <DatabaseIcon className="w-5 text-indigo-600 dark:text-pink-400" />
		</div>
		<h3 className="mt-0 text-2xl mb-1">
		  <Link href={`/admin/database`}>
		    <a
		      data-testid={`service-link-database`}
		      className="font-bold text-zinc-900 pointer-events-auto dark:text-white">
		      Database
		    </a>
		  </Link>
		</h3>
		<p className="truncate text-zinc-500 dark:text-zinc-300 mb-6">
		  Serverless postgres database
		</p>
	      </div>
	    </div>
	    <div className="mb-6 md:mb-0 text-left relative card hover:shadow-lg transition-shadow tbc">
	      <Link href={`/admin/users`}>
		<a className="absolute top-0 left-0 w-full h-full z-30"></a>
	      </Link>
	      <div className="relative z-40 pointer-events-none p-6 pb-0 md:pb-0">
		<div className="flex items-center justify-between mb-3">
		  <UsersIcon className="w-5 text-indigo-600 dark:text-pink-400" />
		</div>
		<h3 className="mt-0 text-2xl mb-1">
		  <Link href={`/admin/users`}>
		    <a
		      data-testid={`service-link-apps`}
		      className="font-bold text-zinc-900 pointer-events-auto dark:text-white">
		      Users
		    </a>
		  </Link>
		</h3>
		<p className="truncate text-zinc-500 dark:text-zinc-300 mb-6">
		  User authentication & management
		</p>
	      </div>
	    </div>
          </div>
        </div>
      </section>
      </DashboardLayout>
    </>
  )
}

export default AdminPage
