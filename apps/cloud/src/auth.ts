export function returnLoginUrl(): string {
  return process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/login?redirect=cloud'
    : 'https://m3o.com/login?redirect=cloud'
}
