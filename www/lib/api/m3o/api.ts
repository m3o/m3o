import axios from 'axios'

export const m3oInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})
