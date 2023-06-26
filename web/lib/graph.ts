import type { FormattedUsage } from '@/types'
import { TimeSelections } from './constants'

interface DrawGraph {
  usage: FormattedUsage
  timeSelect: TimeSelections
}

export function drawGraph({}: DrawGraph) {}
