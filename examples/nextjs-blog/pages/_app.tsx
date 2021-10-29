import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { CookiesProvider } from 'react-cookie';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { SiteHeader } from '../components/SiteHeader';
import 'tailwindcss/tailwind.css';
import { AuthProvider } from '../components/AuthProvider';

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <CookiesProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <SiteHeader />
            <div className="bg-gray-50 min-h-screen">
              <Component {...pageProps} />
            </div>
          </Hydrate>
        </QueryClientProvider>
      </AuthProvider>
    </CookiesProvider>
  );
}

export default MyApp;
