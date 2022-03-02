import axios from 'axios'
import { returnLoginUrl } from '../utils/auth'

const m3oClient = axios.create({
  baseURL: 'https://api.m3o.com/v1/'
})

m3oClient.interceptors.request.use((config) => {
  const cookieValue = document.cookie
    .split('; ')
    .find((item) => item.includes('micro_api_token='))

  if (!cookieValue) {
    window.location.href = returnLoginUrl()
    return
  }

  const { 1: token } = cookieValue.split('=')

  config.headers!.authorization = `Bearer ${token}`

  return config
})

export { m3oClient }
