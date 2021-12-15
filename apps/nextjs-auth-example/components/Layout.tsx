import React, { ReactElement, PropsWithChildren } from 'react'
import { Header } from './Header'

export function Layout({ children }: PropsWithChildren<{}>): ReactElement {
  return (
    <div>
      <Header />
      <div className="container">{children}</div>
      <style jsx global>{`
        .container {
          max-width: 77.5rem;
          margin: 0 auto;
        }

        .flex {
          display: flex;
        }
      `}</style>
      <style jsx global>{`
        body {
          margin: 0;
          color: #333;
          font-family: ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial,
            Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji,
            Segoe UI Symbol, Noto Color Emoji;
        }
      `}</style>
    </div>
  )
}
