import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import * as NextImage from 'next/image'
import '../styles/globals.css'

const OriginalNextImage = NextImage.default

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: props => <OriginalNextImage {...props} unoptimized />,
})

const queryClient = new QueryClient()

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  layout: 'fullscreen',
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  story => (
    <div className="bg-zinc-900 text-white min-h-screen">
      <QueryClientProvider client={queryClient}>
        {story()}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  ),
]

export const globalTypes = {
  darkMode: true,
}
