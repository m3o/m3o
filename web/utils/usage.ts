import { Usage, FormattedUsage, FormattedUsageItem } from '@/types'
import { isSameMonth, sub, isWithinInterval } from 'date-fns'

export const returnCorrectDateFromString = (dateStr: string): Date =>
  new Date(parseInt(dateStr, 10) * 1000)

const removeItemWithEmptyRecords = (item: FormattedUsageItem): boolean =>
  !!item.records.length

export function formatUsageItems(usage: Usage): FormattedUsage {
  return Object.entries(usage).map(([key, value]) => ({
    name: key,
    records: value.records.map(item => ({
      apiName: key,
      date: returnCorrectDateFromString(item.date),
      requests: parseInt(item.requests),
    })),
  }))
}

export function returnUsageForThisMonth(usage: FormattedUsage): FormattedUsage {
  const today = new Date()

  return usage
    .map(item => ({
      ...item,
      records: item.records.filter(record => isSameMonth(record.date, today)),
    }))
    .filter(item => !!item.records.length)
}

export function returnUsageForLastMonth(usage: FormattedUsage): FormattedUsage {
  const today = new Date()
  const lastMonth = sub(today, { months: 1 })

  return usage
    .map(item => ({
      ...item,
      records: item.records.filter(record =>
        isSameMonth(record.date, lastMonth),
      ),
    }))
    .filter(removeItemWithEmptyRecords)
}

export function returnUsageForLast30Days(
  usage: FormattedUsage,
): FormattedUsage {
  const today = new Date()
  const thirtyDaysAgo = sub(today, { days: 30 })

  return usage
    .map(item => ({
      ...item,
      records: item.records.filter(record =>
        isWithinInterval(record.date, { start: thirtyDaysAgo, end: today }),
      ),
    }))
    .filter(removeItemWithEmptyRecords)
}
