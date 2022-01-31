import { AppService } from 'm3o/app'
import { getApiToken } from '../../utils'
import { applyRedirectMixin } from '../../mixins/applyRedirectMixin'

applyRedirectMixin(AppService)

export const apps = new AppService(getApiToken())
