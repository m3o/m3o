import type { FC } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@/providers'
import { ArrowRightIcon } from '@heroicons/react/outline'
import { sessionStorage } from '@/utils/storage'
import { Routes } from '@/lib/constants'
import { GET_STARTED_STORAGE_KEY } from '@/lib/constants'
import { Button } from './Button'

export const GetStartedButton: FC = () => {
  const router = useRouter()
  const user = useUser()

  function onClick() {
    if (!user) {
      // Use this for onboarding or login return
      sessionStorage.setItem(GET_STARTED_STORAGE_KEY, router.asPath)
      router.push(Routes.Login)
    }
  }

  if (user) {
    // # Temp while I work out the best thing to do here.
    return null
  }

  return (
    <Button className="flex items-center" onClick={onClick}>
      Get Started <ArrowRightIcon className="w-4 ml-4" />
    </Button>
  )
}
