import type { CreateRequest, CreateResponse } from 'm3o/user'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../../providers/ToastProvider'
import { m3oClient } from '../../../lib/m3o-client'

export function useAddUser() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  return useMutation(
    (fields: CreateRequest) =>
      m3oClient.post<CreateResponse>('user/create', {
        ...fields,
        username: fields.email
      }),
    {
      onSuccess: () => {
        navigate('/users')
        showToast({ type: 'Success', message: 'User successfully created!' })
      }
    }
  )
}
