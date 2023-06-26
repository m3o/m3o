import type { FC } from 'react'
import type {
  FormattedUsage,
  FormattedUsageRecord,
  FormattedUsageItem,
} from '@/types'
import * as d3 from 'd3'
import { useEffect, useRef, useCallback } from 'react'
import { isSameDay } from 'date-fns'
import { TimeSelections } from './Usage.constants'
import { returnDatesForXPositions } from './Usage.utils'

interface Props {
  usage: FormattedUsage
  currentTimeSelection: TimeSelections
}

const MARGIN = {
  top: 10,
  right: 80,
  bottom: 30,
  left: 50,
}

export const LineGraph: FC<Props> = ({ usage, currentTimeSelection }) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const draw = useCallback(() => {
    if (!svgRef.current || !rootRef.current) return

    const height = rootRef.current.offsetHeight - MARGIN.top - MARGIN.bottom
    const width = rootRef.current.offsetWidth - MARGIN.left - MARGIN.right
    const fullWidth = width + MARGIN.left + MARGIN.right
    const fullHeight = height + MARGIN.top + MARGIN.bottom

    const svg = d3
      .select(svgRef.current)
      .attr('width', fullWidth)
      .attr('height', fullHeight)
      .attr('viewBox', `0,0,${fullWidth},${fullHeight}`)
      .append('g')
      .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`)

    const dates = returnDatesForXPositions(currentTimeSelection)

    const usageWithFilledInGaps = usage.reduce((arr, item) => {
      const filledInGaps = dates.map(date => {
        const record = item.records.find(r => isSameDay(r.date, date))
        return !!record ? record : { date, requests: 0, apiName: item.name }
      })

      return [
        ...arr,
        {
          ...item,
          records: filledInGaps,
        },
      ]
    }, [] as FormattedUsageItem[])

    const x = d3
      .scaleTime()
      .domain([dates[0], dates[dates.length - 1]])
      .range([0, width])

    const y = d3
      .scaleLinear()
      .domain([
        0,
        Math.max(
          ...usageWithFilledInGaps
            .flatMap(item => item.records)
            .map(item => item.requests),
        ),
      ])
      .range([height, 0])

    const xAxis = d3.axisBottom(x).ticks(5)
    const yAxis = d3.axisLeft(y)

    svg.append('g').attr('transform', `translate(0, ${height})`).call(xAxis)
    svg.append('g').call(yAxis)

    svg
      .append('g')
      .selectAll('.line')
      .data(usageWithFilledInGaps)
      .enter()
      .append('path')
      .attr('fill', 'transparent')
      .attr('stroke-width', 2)
      .attr('stroke', 'rgb(236 72 153 / var(--tw-text-opacity))')
      .attr('d', d => {
        return d3
          .line<FormattedUsageRecord>()
          .x(d => x(d.date))
          .y(d => y(d.requests))(d.records)
      })
  }, [currentTimeSelection, usage])

  const remove = useCallback(() => {
    d3.select(svgRef.current).selectAll('*').remove()
  }, [])

  useEffect(() => {
    if (!svgRef.current || !rootRef.current) return

    draw()

    return () => {
      remove()
    }
  }, [usage, currentTimeSelection, draw, remove])

  useEffect(() => {
    // TODO: Make this more performant and elegant
    function handleResize() {
      remove()
      draw()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [remove, draw])

  return (
    <div className="p-6 w-full h-96" ref={rootRef}>
      <svg ref={svgRef} />
    </div>
  )
}
