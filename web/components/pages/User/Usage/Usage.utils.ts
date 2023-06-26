import {
  startOfMonth,
  sub,
  getDaysInMonth,
  differenceInDays,
  add,
  startOfDay,
} from 'date-fns'
import { TimeSelections } from './Usage.constants'

export function returnDatesForXPositions(currentTime: TimeSelections): Date[] {
  const today = startOfDay(new Date())

  if (currentTime === TimeSelections.ThisMonth) {
    const diff = differenceInDays(startOfMonth(today), today)

    let dates = []

    for (let i = diff; i < 0; i++) {
      dates.push(add(today, { days: i }))
    }

    return dates
  }

  if (currentTime === TimeSelections.Past30Days) {
    return Array(30)
      .fill(undefined)
      .map((_, i) => add(today, { days: -29 + i }))
  }

  const firstDayOfLastMonth = startOfMonth(sub(today, { months: 1 }))
  const daysLastMonth = getDaysInMonth(sub(today, { months: 1 }))

  return new Array(daysLastMonth)
    .fill(undefined)
    .map((_, i) => add(firstDayOfLastMonth, { days: i }))
}
