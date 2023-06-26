import '../styles/global.css'

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    videoEnabled?: boolean
    audioEnabled?: boolean
  }
}

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
