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
  bash: {
    'User.List':
      'https://raw.githubusercontent.com/m3o/m3o-sh/main/examples/user/list/listAllUsers.sh',
    'User.Login':
      'https://raw.githubusercontent.com/m3o/m3o-sh/main/examples/user/login/logAUserIn.sh',
    'User.Create':
      'https://raw.githubusercontent.com/m3o/m3o-sh/main/examples/user/create/createAnAccount.sh',
    'Db.Create':
      'https://raw.githubusercontent.com/m3o/m3o-sh/main/examples/db/create/createARecord.sh',
    'Db.Read':
      'https://raw.githubusercontent.com/m3o/m3o-sh/main/examples/db/read/readRecords.sh',
    'Db.Delete':
      'https://raw.githubusercontent.com/m3o/m3o-sh/main/examples/db/delete/deleteARecord.sh',
  },
  javascript: {
    'Db.Create':
      'https://raw.githubusercontent.com/m3o/m3o-js/main/examples/db/create/createARecord.js',
    'Db.Read':
      'https://raw.githubusercontent.com/m3o/m3o-js/main/examples/db/read/readRecords.js',
    'Db.Delete':
      'https://raw.githubusercontent.com/m3o/m3o-js/main/examples/db/delete/deleteARecord.js',
    'User.Create':
      'https://raw.githubusercontent.com/m3o/m3o-js/main/examples/user/create/createAnAccount.js',
    'User.Login':
      'https://raw.githubusercontent.com/m3o/m3o-js/main/examples/user/login/logAUserIn.js',
    'User.List':
      'https://raw.githubusercontent.com/m3o/m3o-js/main/examples/user/list/listAllUsers.js',
  },
  go: {
    'User.List':
      'https://raw.githubusercontent.com/m3o/m3o-go/main/examples/user/list/listAllUsers/main.go',
    'User.Login':
      'https://raw.githubusercontent.com/m3o/m3o-go/main/examples/user/login/logAUserIn/main.go',
    'User.Create':
      'https://raw.githubusercontent.com/m3o/m3o-go/main/examples/user/create/createAnAccount/main.go',
    'Db.Create':
      'https://raw.githubusercontent.com/m3o/m3o-go/main/examples/db/create/createARecord/main.go',
    'Db.Read':
      'https://raw.githubusercontent.com/m3o/m3o-go/main/examples/db/read/readRecords/main.go',
    'Db.Delete':
      'https://raw.githubusercontent.com/m3o/m3o-go/main/examples/db/delete/deleteARecord/main.go',
  }
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
