import type { CreateRequest } from 'm3o/db'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { db } from '../db.service'
import { useToast } from '../../../providers/ToastProvider'

export function useCreateDb() {
  const { showToast } = useToast()
  const navigate = useNavigate()

  return useMutation(
    (values: CreateRequest) =>
      db.create({
        table: values.table!,
        record: values.record || {}
      }),
    {
      onSuccess: () => {
        showToast({ type: 'Success', message: 'Successfully created DB table' })
        navigate('/database')
      },
      onError: () => {
        showToast({ type: 'Error', message: 'Error creating DB table' })
      }
    }
  )
}
