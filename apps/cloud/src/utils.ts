import format from 'date-fns/format'

export const deDupe = <A extends any[]>(arr: A) => Array.from(new Set(arr))

export const formatDate = (dateStr: number) =>
  format(new Date(Number(dateStr) * 1000), 'hh:mm do LLL yyyy')

export function getApiToken() {
  const { 2: value } =
    document.cookie.match(new RegExp('(^| )micro_api_token=([^;]+)')) || []
  return value || ''
}
