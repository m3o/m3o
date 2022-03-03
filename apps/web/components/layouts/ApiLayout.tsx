import type { FormattedService } from '@/types'
import { FC, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import classnames from 'classnames'
import { NextSeo } from 'next-seo'
import { WithAuthProps } from '@/lib/api/m3o/withAuth'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import { useDownloadFile, useGetRelatedApis, useRecentlyViewed } from '@/hooks'
import { getDescription } from '@/utils/api'
import { Routes } from '@/lib/constants'
import { Footer, Header, Top10UsersButton } from '@/components/ui'
import { RoundCircleCtas } from '../pages/Api/RoundCircleCtas'
import { CategoryBubble } from '../ui/CategoryBubble'
import { Navigation, RelatedItems, DownloadModal } from '@/components/pages/Api'
import Link from 'next/link'

type ApiLayoutProps = WithAuthProps &
  Pick<FormattedService, 'summaryDescription' | 'category' | 'name'> & {
    displayName: string
    contentClassName?: string
  }

export const CLOUD_APIS = ['app', 'user', 'db']

export const ApiLayout: FC<ApiLayoutProps> = ({
  category,
  contentClassName,
  children,
  displayName,
  name,
  summaryDescription,
  user,
}) => {
  const { data: relatedItems = [], isLoading } = useGetRelatedApis(
    name,
    category,
  )
  const { addApiToRecentlyViewed } = useRecentlyViewed()
  const router = useRouter()
  const downloadFile = useDownloadFile()
  const shortDescription = summaryDescription.split('#')[0]
  const seoTitle = `${displayName} API - ${shortDescription.trimEnd()}`
  const seoDescription = getDescription(summaryDescription)
  const seoUrl = `https://m3o.com/${router.query.api}`

  const contentClasses = classnames(
    'min-h-screen dark:bg-zinc-900 bg-zinc-50',
    contentClassName,
  )

  const [showDownloadsModal, setShowDownloadsModal] = useState(false)

  useEffect(() => {
    addApiToRecentlyViewed(name)
  }, [addApiToRecentlyViewed, name])

  return (
    <>
      <NextSeo
        title={seoTitle}
        description={seoDescription}
        canonical={seoUrl}
        openGraph={{
          type: 'website',
          url: seoUrl,
          title: seoTitle,
          description: seoDescription,
        }}
      />
      <Header />
      <div className="py-10 border-b tbc">
        <div className="m3o-container">
          <div className="flex justify-between items-center mb-2">
            {/*  */}
            {/* <div className="flex items-center">
              <Top10UsersButton apiName={router.query.api as string} /> */}
            {/* {user && CLOUD_APIS.includes(name) && (
                <a href="https://cloud.m3o.com/users" className="btn">
                  Admin
                </a>
              )} */}
            {/* </div> */}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Link href="/explore">
                <a className="flex mb-6">
                  <ArrowLeftIcon className="w-4 mr-3" /> Back to explore
                </a>
              </Link>
              <CategoryBubble className="inline-block mb-6">
                {category}
              </CategoryBubble>
              <h1 className="font-bold text-5xl md:text-5xl mb-4 mt-2 text-black dark:text-white">
                {displayName}
              </h1>
              <p className="pb-6 text-lg text-zinc-700 dark:text-zinc-300">
                {shortDescription}
              </p>
              <RoundCircleCtas
                apiName={name}
                canManageOnCloud={CLOUD_APIS.includes(name)}
              />
            </div>
            <div className="hidden md:block">
              <Link href={Routes.GettingStarted}>
                <a className="btn inline-block my-6 mb-16 dark:text-white">
                  Get Started
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b tbc">
        <div className="m3o-container">
          <Navigation onDownloadsClick={() => setShowDownloadsModal(true)} />
        </div>
      </div>
      {!user && (
        <div className="m-6 border border-zinc-300 border-solid rounded-md p-6 mb-0 md:hidden dark:bg-zinc-900 dark:border-zinc-600">
          <Link href={Routes.GettingStarted}>
            <a className="btn inline-block my-6 mb-16">Get Started</a>
          </Link>
        </div>
      )}
      <div className={contentClasses}>
        <div className="m3o-container">{children}</div>
        <RelatedItems
          isLoading={isLoading}
          items={relatedItems}
          apiDisplayName={displayName}
        />
      </div>
      <Footer />
      <DownloadModal
        open={showDownloadsModal}
        closeModal={() => setShowDownloadsModal(false)}
        onDownloadOpenApiClick={() =>
          downloadFile.mutate({ apiName: name, fileType: 'openApi' })
        }
        onDownloadPostmanClick={() =>
          downloadFile.mutate({ apiName: name, fileType: 'postman' })
        }
        openApiLoading={
          downloadFile.isLoading &&
          !!downloadFile.variables &&
          downloadFile.variables.fileType === 'openApi'
        }
        postmanLoading={
          downloadFile.isLoading &&
          !!downloadFile.variables &&
          downloadFile.variables.fileType === 'postman'
        }
      />
    </>
  )
}
