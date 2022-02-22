import cookie from 'cookie'

export const serializeCookie = (name: string, value: string, expires?: Date) =>
  cookie.serialize(name, value, {
    path: '/',
    domain: process.env.NODE_ENV === 'development' ? 'localhost' : '.m3o.com',
    expires,
  })
