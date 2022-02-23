import { useMutation } from 'react-query'
import { logoutUser } from '@/lib/api/local/user'
import { localStorage } from '@/utils/storage'
import { RECENTLY_VIEWED_KEY } from '@/lib/constants'

export function useLogout() {
  return useMutation(logoutUser, {
    onSuccess: () => {
      localStorage.deleteItem(RECENTLY_VIEWED_KEY)
      window.location.href = '/'
    },
  })
}
