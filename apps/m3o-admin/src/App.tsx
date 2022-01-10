import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { LandingScreen } from './screens/LandingScreen'
import { DatabaseScreen } from './database/screens/DatabaseScreen'
import { TableScreen } from './database/screens/TableScreen'
import { UsersScreen } from './users/screens/UsersScreen'
import { UserScreen } from './users/screens/UserScreen'
import { Layout } from './components/Layout'

const queryClient = new QueryClient()

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [cookies] = useCookies()

  useEffect(() => {
    if (!cookies['micro_api_token']) {
      window.location.href =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/login'
          : 'https://m3o.com/login'
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
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingScreen />} />
            <Route path="database" element={<DatabaseScreen />} />
            <Route path="database/:tableName" element={<TableScreen />} />
            <Route path="users" element={<UsersScreen />} />
            <Route path="users/:id" element={<UserScreen />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
