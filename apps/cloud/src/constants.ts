export enum Routes {
  Database = '/database'
}

export const URLS: Record<NodeJS.ProcessEnv['NODE_ENV'], string> = {
  development: 'http://localhost:3000',
  production: 'https://m3o.com',
  test: 'http://localhost:3000'
}

export const LOGIN_URL = '/login?redirect=cloud'
export const MICRO_API_TOKEN_COOKIE_NAME = 'micro_api_token'
