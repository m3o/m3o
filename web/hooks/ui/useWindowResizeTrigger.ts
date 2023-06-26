import { useState, useEffect, useCallback } from 'react'

export function useWindowResizeTrigger() {
  const [isMobile, setIsMobile] = useState(
    process.browser ? window.innerWidth < 768 : false,
  )

  const handleWindowResize = useCallback(() => {
    if (isMobile && window.innerWidth >= 768) {
      setIsMobile(false)
    }

    if (!isMobile && window.innerWidth < 768) {
      setIsMobile(true)
    }
  }, [isMobile])

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  })

  return {
    isMobile,
  }
}
