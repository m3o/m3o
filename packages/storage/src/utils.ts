import { Query, QueryOperators } from './types'

function detectTypeAndReturnFormatted(value: string | number) {
  return typeof value === 'string' ? `"${value}"` : value
}

export function returnQueryString<T>(query: Query<T>) {
  if (!query.where) {
    return ''
  }

  return Object.keys(query.where).reduce((str, key) => {
    const value = query.where![key as keyof T]
    let item = ''

    if (!value) {
      return item
    }

    switch (typeof value) {
      case 'object':
        const casted = value as QueryOperators

        if (casted.not) {
          item = `${key} != ${detectTypeAndReturnFormatted(casted.not)}`
        }

        break
      case 'string':
        item = `${key} == "${value}"`
        break
      default:
        item = ''
        break
    }

    return str + item
  }, '')
}
