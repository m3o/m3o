import { getApiToken } from '../utils'
import { returnLoginUrl } from '../auth'

export function applyRedirectMixin<S extends Function>(Service: S) {
  const methods = Object.getOwnPropertyNames(Service.prototype).filter(
    (item) => item !== 'constructor'
  )

  methods.forEach((method) => {
    const typed = method as keyof typeof Service.prototype
    const prevMethod = Service.prototype[typed]

    Service.prototype[typed] = function () {
      const token = getApiToken()

      if (!token) {
        // Kinda of hack while this is not in the main app.
        window.location.href = returnLoginUrl()
      }

      return prevMethod.apply(this, arguments)
    }
  })
}
