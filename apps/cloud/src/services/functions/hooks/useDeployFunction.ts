import type { UseMutateFunction } from 'react-query'
import type { DeployResponse, DeployRequest } from 'm3o/function'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { functions } from '../functions.service'
import { useToast } from '../../../providers/ToastProvider'

interface UseDeployFunction {
  run: UseMutateFunction<DeployResponse, unknown, DeployRequest, unknown>
  isLoading: boolean
}

export function useDeployFunction(): UseDeployFunction {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const { mutate, isLoading } = useMutation((values: any) => functions.deploy(values), {
    onSuccess: () => {
      navigate('/functions')
      showToast({ type: 'Success', message: 'Function successfully created' })
    }
  })

  return {
    run: mutate,
    isLoading
  }
}
