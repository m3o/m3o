import { useMutation } from 'react-query'
import { fetchRecoveryCode } from '../../lib/api/m3o/services/auth'

export function useFetchRecoveryCode() {
  return useMutation((email: string) => fetchRecoveryCode(email))
}
