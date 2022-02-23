import type { Languages } from '@/types'
import { useState } from 'react'

export function useSelectLanguage(initialSelected: Languages = 'bash') {
  const [language, setLanguage] = useState<Languages>(initialSelected)

  return {
    language,
    onLanguageChange: setLanguage,
  }
}
