import { useState, useEffect } from 'react'

interface UseCopyToClipboard {
  copied: boolean
  copy: (valueToCopy: string) => void
}

export function useCopyToClipboard(): UseCopyToClipboard {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 1000)
    }
  }, [copied])

  async function copy(valueToCopy: string) {
    await navigator.clipboard.writeText(valueToCopy)
    setCopied(true)
  }

  return {
    copy,
    copied,
  }
}
