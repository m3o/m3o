import type { FC } from 'react'
import type { ModalProps } from '@/components/ui'
import { Button, Modal } from '@/components/ui'

interface Props extends ModalProps {
  onDownloadPostmanClick: VoidFunction
  onDownloadOpenApiClick: VoidFunction
  postmanLoading: boolean
  openApiLoading: boolean
}

export const DownloadModal: FC<Props> = ({
  onDownloadPostmanClick,
  onDownloadOpenApiClick,
  postmanLoading,
  openApiLoading,
  ...props
}) => {
  return (
    <Modal {...props}>
      <h2 className="font-black text-black text-xl mb-4 dark:text-white">
        Downloads
      </h2>
      <div className="border-b border-zinc-300 px-2 py-6 flex justify-between items-center dark:border-zinc-600">
        <div className="w-8/12">
          <h4 className="font-bold mb-2 text-black dark:text-white">
            Postman JSON
          </h4>
          <p className="text-sm">
            Download a Postman collection JSON for{' '}
            <a
              href="https://learning.postman.com/docs/getting-started/importing-and-exporting-data/"
              rel="noreferrer"
              target="_blank">
              importing to the Postman client
            </a>
          </p>
        </div>
        <Button onClick={onDownloadPostmanClick} loading={postmanLoading}>
          Download
        </Button>
      </div>
      <div className="px-2 py-6 flex justify-between items-center">
        <div className="w-9/12 pr-6">
          <h4 className="font-bold mb-2 text-black dark:text-white">
            OpenAPI JSON
          </h4>
          <p className="text-sm">
            Download the OpenAPI json for this API for importing to your
            favourite client
          </p>
        </div>
        <Button onClick={onDownloadOpenApiClick} loading={openApiLoading}>
          Download
        </Button>
      </div>
    </Modal>
  )
}
