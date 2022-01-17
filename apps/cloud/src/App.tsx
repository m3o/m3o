import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { LandingScreen } from './screens/LandingScreen'
import { TableScreen } from './database/screens/TableScreen'
import { UsersScreen } from './users/screens/UsersScreen'
import { UserScreen } from './users/screens/UserScreen'
import { DatabaseLayout } from './database/components/DatabaseLayout'
import { UsersStateProvider } from './users/components/UsersStateProvider'
import { Layout } from './components/Layout'
import { returnLoginUrl } from './auth'

const queryClient = new QueryClient()

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [cookies] = useCookies()

  useEffect(() => {
    if (!cookies['micro_api_token']) {
      window.location.href = returnLoginUrl()
    } else {
      setAuthenticated(true)
    }
  }, [cookies])

  if (!authenticated) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-zinc-900">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingScreen />} />
              <Route path="database" element={<DatabaseLayout />}>
                <Route path=":tableName" element={<TableScreen />} />
              </Route>
              <Route path="users" element={<UsersStateProvider />}>
                <Route index element={<UsersScreen />} />
                <Route path=":id" element={<UserScreen />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
