import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { LandingScreen } from './screens/LandingScreen'
import { TableScreen } from './services/database/screens/TableScreen'
import { UsersScreen } from './services/users/screens/UsersScreen'
import { UserScreen } from './services/users/screens/UserScreen'
import { DatabaseLayout } from './services/database/components/DatabaseLayout'
import { AddUserScreen } from './services/users/screens/AddUserScreen'
import { UsersStateProvider } from './services/users/components/UsersStateProvider'
import { Layout } from './components/Layout'
import { returnLoginUrl } from './auth'
import { ToastProvider } from './providers/ToastProvider'
import { AppsScreen } from './services/apps/screens/AppsScreen'
import { AddAppScreen } from './services/apps/screens/AddAppScreen'

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
      <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-zinc-900 text-white">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<LandingScreen />} />
                <Route path="database" element={<DatabaseLayout />}>
                  <Route path=":tableName" element={<TableScreen />} />
                </Route>
                <Route path="users" element={<UsersStateProvider />}>
                  <Route index element={<UsersScreen />} />
                  <Route path=":id" element={<UserScreen />} />
                  <Route path="add" element={<AddUserScreen />} />
                </Route>
                <Route path="apps">
                  <Route index element={<AppsScreen />} />
                  <Route path="add" element={<AddAppScreen />} />
                </Route>
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </ToastProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
