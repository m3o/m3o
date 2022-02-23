import type { Languages } from '@/types'
import { useQuery } from 'react-query'
import { LandingPageExampleNames } from '@/lib/constants'
import { delay } from '@/utils/api'

interface UseFetchExample {
  language: Languages
  selectedExample: LandingPageExampleNames
}

type Examples = Record<Languages, Record<LandingPageExampleNames, string>>

// Easier for the moment.
const EXAMPLES: Examples = {
  javascript: {
    'Db.Create':
      'https://raw.githubusercontent.com/m3o/m3o-js/main/examples/db/create/createARecord.js',
    'Db.Read':
      'https://raw.githubusercontent.com/m3o/m3o-js/main/examples/db/read/readRecords.js',
    'User.Create':
      'https://raw.githubusercontent.com/m3o/m3o-js/main/examples/user/create/createAnAccount.js',
    'User.Login':
      'https://raw.githubusercontent.com/m3o/m3o-js/main/examples/user/login/logAUserIn.js',
  },
  go: {
    'User.Login':
      'https://raw.githubusercontent.com/m3o/m3o-go/main/examples/user/login/logAUserIn/main.go',
    'User.Create':
      'https://raw.githubusercontent.com/m3o/m3o-go/main/examples/user/create/createAnAccount/main.go',
    'Db.Create':
      'https://raw.githubusercontent.com/m3o/m3o-go/main/examples/db/create/createARecord/main.go',
    'Db.Read':
      'https://raw.githubusercontent.com/m3o/m3o-go/main/examples/db/read/readRecords/main.go',
  },
  bash: {
    'User.Login':
      'https://raw.githubusercontent.com/m3o/m3o-sh/main/examples/user/login/logAUserIn.sh',
    'User.Create':
      'https://raw.githubusercontent.com/m3o/m3o-sh/main/examples/user/create/createAnAccount.sh',
    'Db.Create':
      'https://raw.githubusercontent.com/m3o/m3o-sh/main/examples/db/create/createARecord.sh',
    'Db.Read':
      'https://raw.githubusercontent.com/m3o/m3o-sh/main/examples/db/read/readRecords.sh',
  },
}

export function useFetchExample({
  language,
  selectedExample,
}: UseFetchExample) {
  return useQuery(
    ['landing-page-example', language, selectedExample],
    async () => {
      const response = await fetch(EXAMPLES[language][selectedExample])
      await delay(300)
      return await response.text()
    },
  )
}
