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
    'Cache.Get':
      'https://raw.githubusercontent.com/m3o/m3o-js/main/examples/cache/get/getAValue.js',
    'Cache.Set':
      'https://raw.githubusercontent.com/m3o/m3o-js/main/examples/cache/set/setAValue.js',
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
    'Cache.Get':
      'https://raw.githubusercontent.com/m3o/m3o-go/main/examples/cache/get/getAValue/main.go',
    'Cache.Set':
      'https://raw.githubusercontent.com/m3o/m3o-go/main/examples/cache/set/setAValue/main.go',
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
    'Cache.Get':
      'https://raw.githubusercontent.com/m3o/m3o-sh/main/examples/cache/get/getAValue.sh',
    'Cache.Set':
      'https://raw.githubusercontent.com/m3o/m3o-sh/main/examples/cache/set/setAValue.sh',
    'User.Login':
      'https://raw.githubusercontent.com/m3o/m3o-sh/main/examples/user/login/logAUserIn.sh',
    'User.Create':
      'https://raw.githubusercontent.com/m3o/m3o-sh/main/examples/user/create/createAnAccount.sh',
    'Db.Create':
      'https://raw.githubusercontent.com/m3o/m3o-sh/main/examples/db/create/createARecord.sh',
    'Db.Read':
      'https://raw.githubusercontent.com/m3o/m3o-sh/main/examples/db/read/readRecords.sh',
  },
  cli: {
    'Cache.Get':
      'https://raw.githubusercontent.com/m3o/m3o-cli/main/examples/cache/get/getAValue.sh',
    'Cache.Set':
      'https://raw.githubusercontent.com/m3o/m3o-cli/main/examples/cache/set/setAValue.sh',
    'User.Login':
      'https://raw.githubusercontent.com/m3o/m3o-cli/main/examples/user/login/logAUserIn.sh',
    'User.Create':
      'https://raw.githubusercontent.com/m3o/m3o-cli/main/examples/user/create/createAnAccount.sh',
    'Db.Create':
      'https://raw.githubusercontent.com/m3o/m3o-cli/main/examples/db/create/createARecord.sh',
    'Db.Read':
      'https://raw.githubusercontent.com/m3o/m3o-cli/main/examples/db/read/readRecords.sh',
  },
  dart: {
    'Cache.Get':
      'https://raw.githubusercontent.com/m3o/m3o-dart/main/example/cache/get/getAValue/main.dart',
    'Cache.Set':
      'https://raw.githubusercontent.com/m3o/m3o-dart/main/example/cache/set/setAValue/main.dart',
    'User.Login':
      'https://raw.githubusercontent.com/m3o/m3o-dart/main/example/user/login/logAUserIn/main.dart',
    'User.Create':
      'https://raw.githubusercontent.com/m3o/m3o-dart/main/example/user/create/createAnAccount/main.dart',
    'Db.Create':
      'https://raw.githubusercontent.com/m3o/m3o-dart/main/example/db/create/createARecord/main.dart',
    'Db.Read':
      'https://raw.githubusercontent.com/m3o/m3o-dart/main/example/db/read/readRecords/main.dart',
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
