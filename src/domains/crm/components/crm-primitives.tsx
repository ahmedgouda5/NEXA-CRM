import { Check, ChevronsUpDown } from 'lucide-react'
import { colorFor, initials } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import type { RichText } from '../crm.types'

export function RichBody({ parts }: { parts: RichText }) {
  return (
    <>
      {parts.map((part, index) =>
        part.strong ? <b key={index}>{part.text}</b> : <span key={index}>{part.text}</span>,
      )}
    </>
  )
}

export function AvatarChip({
  seed,
  name,
  size = 'sm',
  className,
}: {
  seed: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <span
      className={cn(
        'avatar',
        size === 'sm' && 'avatar-sm',
        size === 'lg' && 'avatar-lg',
        className,
      )}
      style={{ background: colorFor(seed) }}
      title={name}
    >
      {initials(name)}
    </span>
  )
}

export function Sparkline({
  values,
  color = '#4C7DFF',
  height = 34,
}: {
  values: number[]
  color?: string
  height?: number
}) {
  const width = 100
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  const step = values.length > 1 ? width / (values.length - 1) : width
  const points = values
    .map((value, index) => {
      const x = index * step
      const y = height - ((value - min) / span) * (height - 6) - 3
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  const area = `0,${height} ${points} ${width},${height}`

  return (
    <svg
      className="sparkline"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="trend"
    >
      <polygon points={area} fill={color} opacity={0.12} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export function MiniSearch({
  value,
  onChange,
  placeholder = 'Search…',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="mini-search">
      <SearchGlyph />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  )
}

function SearchGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" strokeLinecap="round" />
    </svg>
  )
}

export function Chip({
  active,
  onClick,
  children,
  icon,
}: {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      className="chip"
      onClick={onClick}
      data-active={active ? 'true' : 'false'}
      style={active ? { color: 'var(--text)', borderColor: 'var(--border-strong)' } : undefined}
    >
      {icon}
      {children}
    </button>
  )
}

export function SortHeader<K extends string>({
  label,
  column,
  active,
  direction,
  onSort,
  className,
}: {
  label: string
  column: K
  active: K
  direction: 'asc' | 'desc'
  onSort: (column: K) => void
  className?: string
}) {
  return (
    <th className={className}>
      <button
        type="button"
        className="th-sortable"
        onClick={() => onSort(column)}
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        {label}
        {active === column ? (
          direction === 'asc' ? (
            <ChevronsUpDown className="sort-arrow" style={{ width: 12, height: 12 }} />
          ) : (
            <ChevronsUpDown
              className="sort-arrow"
              style={{ width: 12, height: 12, transform: 'rotate(180deg)' }}
            />
          )
        ) : null}
      </button>
    </th>
  )
}

export function Pager({
  page,
  pageCount,
  onPage,
}: {
  page: number
  pageCount: number
  onPage: (page: number) => void
}) {
  return (
    <div className="pager">
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
        <button
          key={item}
          type="button"
          className={item === page ? 'active' : undefined}
          onClick={() => onPage(item)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

export function TaskCheck({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className={checked ? 'task-check checked' : 'task-check'}
      onClick={onToggle}
      aria-pressed={checked}
      aria-label={checked ? 'Mark as open' : 'Mark as done'}
    >
      {checked ? <Check /> : null}
    </button>
  )
}

export function StatusPill({ status }: { status: 'Active' | 'Lead' | 'Inactive' }) {
  const cls =
    status === 'Active' ? 'status-active' : status === 'Lead' ? 'status-lead' : 'status-inactive'
  return <span className={`status-pill ${cls}`}>{status}</span>
}

export function PriorityPill({ priority }: { priority: 'High' | 'Medium' | 'Low' }) {
  return <span className={`pill pri-${priority}`}>{priority}</span>
}

export function CompanyMark({ name }: { name: string }) {
  return (
    <span className="deal-logo" style={{ background: colorFor(name) }}>
      {initials(name).slice(0, 1)}
    </span>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { key: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="segmented" role="tablist">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          role="tab"
          aria-selected={option.key === value}
          className={option.key === value ? 'active' : undefined}
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
