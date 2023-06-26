import { useMutation } from 'react-query'
import { downloadFile } from '@/utils/file'
import { fetchSingleService } from '@/lib/api/m3o/services/explore'

interface UseDownloadFile {
  apiName: string
  fileType: 'postman' | 'openApi'
}

export function useDownloadFile() {
  return useMutation(async (payload: UseDownloadFile) => {
    const service = await fetchSingleService(payload.apiName)

    return downloadFile(
      payload.fileType === 'openApi'
        ? service.openApiString
        : service.postmanString,
      payload.fileType === 'openApi' ? 'open_api' : 'postman_api',
    )
  })
}
