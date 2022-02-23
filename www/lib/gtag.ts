interface GTagEvent {
  action: string
  category: string
  label: string
  value?: number
}

declare global {
  interface Window {
    gtag: (
      name: string,
      trackingId: string,
      obj: Record<string, unknown>,
    ) => void
  }
}

export const pageview = (url: string) => {
  if (process.env.NODE_ENV !== 'production') return
  window.gtag('config', 'UA-70478210-4', {
    page_path: url,
  })
}

export const gaEvent = ({
  action,
  category,
  label,
  value,
}: GTagEvent): void => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}
