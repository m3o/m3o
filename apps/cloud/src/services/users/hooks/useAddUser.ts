import type { CreateUserFields } from '../user.types'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useUserInstance } from './useUsersInstance'
import { useToast } from '../../../providers/ToastProvider'

export function useAddUser() {
  const user = useUserInstance()
  const navigate = useNavigate()
  const { showToast } = useToast()

  return useMutation(
    (fields: CreateUserFields) =>
      user.create({ ...fields, username: fields.email }),
    {
      onSuccess: () => {
        navigate('/users')
        showToast({ type: 'Success', message: 'User successfully created!' })
      }
    }
  )
}
