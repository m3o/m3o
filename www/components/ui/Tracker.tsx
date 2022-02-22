import type { FC } from 'react'
import { useEffect } from 'react'
import addYears from 'date-fns/addYears'
import { v4 } from 'uuid'
import { useCookies } from 'react-cookie'
import { TrackingCookieNames } from '@/lib/constants'
import { track } from '@/lib/api/m3o/services/tracking'

export const Tracker: FC = ({ children }) => {
  const [cookies, setCookie] = useCookies()

  useEffect(() => {
    const firstVisitCookie = cookies[TrackingCookieNames.FirstVisit]

    // TODO: Potentially move this to the server
    function trackFirstVisit() {
      const firstVisit = Math.floor(Date.now() / 1000)
      const id = v4()
      const oneYear = addYears(new Date(), 1)

      setCookie(TrackingCookieNames.TrackingId, id, {
        path: '/',
        expires: oneYear,
      })

      setCookie(TrackingCookieNames.FirstVisit, firstVisit.toString(), {
        path: '/',
        expires: oneYear,
      })

      track({ id, firstVisit, referrer: document.referrer })
    }

    if (!firstVisitCookie) {
      trackFirstVisit()
    }
  }, [cookies, setCookie])

  return <>{children}</>
}
