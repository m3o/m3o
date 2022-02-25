import { FunctionService } from 'm3o/function'
import { getApiToken } from '../../utils'
import { applyRedirectMixin } from '../../mixins/applyRedirectMixin'

applyRedirectMixin(FunctionService)

export const functions = new FunctionService(getApiToken())
