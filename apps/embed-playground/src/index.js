import { render } from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { App } from './app'
import { HomeScreen } from './screens/home-screen'
import { WidgetScreen } from './screens/widget-screen'

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomeScreen />} />
        <Route path="/widget" element={<WidgetScreen />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root'),
)
