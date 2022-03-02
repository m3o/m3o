import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { apps } from '../apps.service'
import { useToast } from '../../../providers/ToastProvider'

export function useRunApp() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const { mutate, isLoading } = useMutation((values: any) => apps.run(values), {
    onSuccess: () => {
      navigate('/apps')
      showToast({ type: 'Success', message: 'App successfully created' })
    }
  })

  return {
    run: mutate,
    isLoading
  }
}
