import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { LandingScreen } from './screens/LandingScreen'
import { DatabaseScreen } from './screens/DatabaseScreen'
import { TableScreen } from './screens/TableScreen'
import { LoginScreen } from './screens/LoginScreen'
import { UsersScreen } from './screens/UsersScreen'
import { Layout } from './components/Layout'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingScreen />} />
            <Route path="database" element={<DatabaseScreen />} />
            <Route path="database/:tableName" element={<TableScreen />} />
            <Route path="users" element={<UsersScreen />} />
          </Route>
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
