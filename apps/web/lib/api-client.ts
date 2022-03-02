import axios from 'axios'

export function createApiClient(passedToken?: string) {
  const apiClient = axios.create({
    baseURL: 'https://api.m3o.com/v1/',
  })

  apiClient.interceptors.request.use(config => {
    if (!passedToken) {
      const cookieValue = document.cookie
        .split('; ')
        .find(item => item.includes('micro_api_token='))

      if (cookieValue) {
        const { 1: token } = cookieValue.split('=')
        config.headers!.authorization = `Bearer ${token}`
      }
    } else {
      config.headers!.authorization = `Bearer ${passedToken}`
    }

    return config
  })

  return apiClient
}

export const apiClient = createApiClient()
