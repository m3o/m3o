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
import { CategoryBubble } from '../ui/CategoryBubble'
import { Navigation, RelatedItems, DownloadModal } from '@/components/pages/Api'
import Link from 'next/link'

type ApiLayoutProps = WithAuthProps &
  Pick<FormattedService, 'summaryDescription' | 'category' | 'name'> & {
    displayName: string
    contentClassName?: string
  }

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
      <div className="py-8 border-b tbc">
        <div className="m3o-container">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/explore">
                <a className="flex mb-6 items-center text-xs">
                  <ArrowLeftIcon className="w-4 mr-3" /> Back to explore
                </a>
              </Link>
              <CategoryBubble className="inline-block mb-6">
                {category}
              </CategoryBubble>
              <h1 className="font-bold text-4xl md:text-5xl my-2 text-black dark:text-white">
                {displayName}
              </h1>
              <p className="pb-6 text-lg text-zinc-700 dark:text-zinc-400 font-light">
                {shortDescription}
              </p>
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
      <div className="bg-zinc-100 dark:bg-zinc-800 mb-8">
        <div className="m3o-container">
          <Navigation onDownloadsClick={() => setShowDownloadsModal(true)} />
        </div>
      </div>
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
