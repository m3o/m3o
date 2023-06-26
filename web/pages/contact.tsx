import { NextSeo } from 'next-seo'
import seo from '@/lib/seo.json'
import { MainLayout } from '@/components/layouts'
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
  return {
    props: {
      user: context.req.user,
    },
  }
})

const ContactPage: NextPage<WithAuthProps> = ({
  user
}) => {
  return (
    <>
      <NextSeo
        title={seo.contact.title}
        description={seo.contact.description}
        canonical="https://m3o.com/contact"
      />
      <MainLayout>
      <section className="px-4 md:px-0 py-12 md:py-24 text-zinc-600 dark:text-zinc-400">
        <div className="md:max-w-4xl lg:max-w-7xl mx-auto w-11/12 mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-6 max-w-2xl dark:text-white font-bold">
            Contact Us
          </h1>
          <h2 className="text-md md:text-lg lg:text-xl max-w-3xl">
            Ask questions, share knowledge and stay in sync
          </h2>
        </div>
        <div className="md:max-w-4xl lg:max-w-7xl mx-auto w-11/12 mb-10">
          <div className="md:grid md:grid-cols-2 lg:grid-cols-2 md:gap-6">
	    <div className="mb-6 md:mb-0 text-left relative card hover:shadow-lg transition-shadow tbc">
	      <Link href="https://discord.gg/TBR9bRjd6Z">
		<a className="absolute top-0 left-0 w-full h-full z-30"></a>
	      </Link>
	      <div className="relative z-40 pointer-events-none p-6 pb-0 md:pb-0">
		<div className="flex items-center justify-between mb-3">
		  <TerminalIcon className="w-5 text-indigo-600 dark:text-pink-400" />
		</div>
		<h3 className="mt-0 text-2xl mb-1">
		  <Link href="https://discord.gg/TBR9bRjd6Z">
		    <a
		      data-testid={`service-link-apps`}
		      className="font-bold text-zinc-900 pointer-events-auto dark:text-white">
		      Discord
		    </a>
		  </Link>
		</h3>
		<p className="truncate text-zinc-500 dark:text-zinc-300 mb-6">
		  Find us on Discord
		</p>
	      </div>
	    </div>
	    <div className="mb-6 md:mb-0 text-left relative card hover:shadow-lg transition-shadow tbc">
	      <Link href="https://m3o.org">
		<a className="absolute top-0 left-0 w-full h-full z-30"></a>
	      </Link>
	      <div className="relative z-40 pointer-events-none p-6 pb-0 md:pb-0">
		<div className="flex items-center justify-between mb-3">
		  <CodeIcon className="w-5 text-indigo-600 dark:text-pink-400" />
		</div>
		<h3 className="mt-0 text-2xl mb-1">
		  <Link href="https://mastodon.social/@m3ocloud">
		    <a
		      data-testid={`service-link-functions`}
		      className="font-bold text-zinc-900 pointer-events-auto dark:text-white">
		     Mastodon
		    </a>
		  </Link>
		</h3>
		<p className="truncate text-zinc-500 dark:text-zinc-300 mb-6">
		  Talk to us on Mastodon
		</p>
	      </div>
	    </div>
	    <div className="mb-6 md:mb-0 text-left relative card hover:shadow-lg transition-shadow tbc">
	      <Link href="https://www.linkedin.com/company/m3o-com">
		<a className="absolute top-0 left-0 w-full h-full z-30"></a>
	      </Link>
	      <div className="relative z-40 pointer-events-none p-6 pb-0 md:pb-0">
		<div className="flex items-center justify-between mb-3">
		  <DatabaseIcon className="w-5 text-indigo-600 dark:text-pink-400" />
		</div>
		<h3 className="mt-0 text-2xl mb-1">
		  <Link href="https://www.linkedin.com/company/m3o-com">
		    <a
		      data-testid={`service-link-database`}
		      className="font-bold text-zinc-900 pointer-events-auto dark:text-white">
		      LinkedIn
		    </a>
		  </Link>
		</h3>
		<p className="truncate text-zinc-500 dark:text-zinc-300 mb-6">
		  For the business user
		</p>
	      </div>
	    </div>
	    <div className="mb-6 md:mb-0 text-left relative card hover:shadow-lg transition-shadow tbc">
	      <Link href="https://twitter.com/m3ocloud">
		<a className="absolute top-0 left-0 w-full h-full z-30"></a>
	      </Link>
	      <div className="relative z-40 pointer-events-none p-6 pb-0 md:pb-0">
		<div className="flex items-center justify-between mb-3">
		  <UsersIcon className="w-5 text-indigo-600 dark:text-pink-400" />
		</div>
		<h3 className="mt-0 text-2xl mb-1">
	          <Link href="https://twitter.com/m3ocloud">
		    <a
		      data-testid={`service-link-apps`}
		      className="font-bold text-zinc-900 pointer-events-auto dark:text-white">
		      Twitter
		    </a>
		  </Link>
		</h3>
		<p className="truncate text-zinc-500 dark:text-zinc-300 mb-6">
		  Follow on twitter for updates
		</p>
	      </div>
	    </div>
          </div>
        </div>
      </section>
      </MainLayout>
    </>
  )
}

export default ContactPage
