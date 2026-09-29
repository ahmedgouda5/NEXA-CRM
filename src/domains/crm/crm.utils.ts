import { STAGES } from './crm.data'
import type { Deal, DealStage } from './crm.types'

export function stageColor(stage: DealStage): string {
  return STAGES.find((item) => item.key === stage)?.color ?? '#6E7079'
}

export function matches(haystack: string, needle: string): boolean {
  if (!needle.trim()) return true
  return haystack.toLowerCase().includes(needle.trim().toLowerCase())
}

export function sortBy<T>(rows: T[], key: keyof T, direction: 'asc' | 'desc'): T[] {
  return [...rows].sort((a, b) => {
    const left = a[key]
    const right = b[key]
    if (typeof left === 'number' && typeof right === 'number') {
      return direction === 'asc' ? left - right : right - left
    }
    return direction === 'asc'
      ? String(left).localeCompare(String(right))
      : String(right).localeCompare(String(left))
  })
}

export function totalBy<T>(rows: T[], pick: (row: T) => number): number {
  return rows.reduce((sum, row) => sum + pick(row), 0)
}

export function openPipeline(deals: Deal[]): Deal[] {
  return deals.filter((deal) => deal.stage !== 'Won' && deal.stage !== 'Lost')
}

export function weightedValue(deals: Deal[]): number {
  return openPipeline(deals).reduce((sum, deal) => sum + deal.value * (deal.prob / 100), 0)
}
