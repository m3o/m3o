import { DbService } from 'm3o/db'
import { getApiToken } from '../../utils'
import { applyRedirectMixin } from '../../mixins/applyRedirectMixin'

applyRedirectMixin(DbService)

export const db = new DbService(getApiToken())
