import type { FormattedService } from '@/types'
import { FC, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { WithAuthProps } from '@/lib/api/m3o/withAuth'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import { useDownloadFile, useGetRelatedApis, useRecentlyViewed } from '@/hooks'
import { getDescription } from '@/utils/api'
import { Footer, Header } from '@/components/ui'
import { Navigation, DownloadModal } from '@/components/pages/Api'
import Link from 'next/link'

type ApiLayoutProps = WithAuthProps &
  Pick<FormattedService, 'summaryDescription' | 'category' | 'name'> & {
    displayName: string
  }

export const ApiLayout: FC<ApiLayoutProps> = ({
  category,
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
      <div className="px-6 lg:px-20 md:px-10 my-6 api-max-width">
        <Link href="/explore">
          <a className="flex mb-6 items-center text-xs">
            <ArrowLeftIcon className="w-4 mr-3" /> Back to explore
          </a>
        </Link>
        <Navigation onDownloadsClick={() => console.log()} />
      </div>
      {children}
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
