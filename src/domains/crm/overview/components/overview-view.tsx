import { useMemo, useState } from 'react'
import {
  Activity,
  CalendarClock,
  Check,
  ChevronRight,
  Download,
  Mail,
  Move,
  Pencil,
  Phone,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { fmtMoney } from '@/shared/lib/format'
import { BRAND } from '@/shared/theme/theme'
import { RichBody, Segmented, Sparkline } from '@/domains/crm/components/crm-primitives'
import { LOST_BASE, REVENUE_BASE, REVENUE_SERIES, STAGES, WON_BASE } from '@/domains/crm/crm.data'
import { useCrmStore } from '@/domains/crm/crm.store'
import type { ActivityKind } from '@/domains/crm/crm.types'
import { openPipeline, totalBy, weightedValue } from '@/domains/crm/crm.utils'
import { useNavigationStore } from '@/domains/navigation'

const ACTIVITY_ICONS: Record<ActivityKind, typeof Pencil> = {
  edit: Pencil,
  lead: Target,
  move: Move,
  mail: Mail,
  check: Check,
  call: Phone,
  win: Trophy,
  note: Pencil,
}

const SPARK = [12, 18, 15, 24, 22, 30, 28, 36, 33, 42, 40, 48]

type RangeLabel = (typeof REVENUE_SERIES)[number]['label']

export function OverviewView() {
  const deals = useCrmStore((state) => state.deals)
  const activities = useCrmStore((state) => state.activities)
  const leads = useCrmStore((state) => state.leads)
  const tasks = useCrmStore((state) => state.tasks)
  const openCreate = useCrmStore((state) => state.openCreate)
  const setView = useNavigationStore((state) => state.setView)
  const [range, setRange] = useState<RangeLabel>('30D')

  const open = openPipeline(deals)
  const pipelineValue = totalBy(open, (deal) => deal.value)
  const won = deals.filter((deal) => deal.stage === 'Won')
  const lost = deals.filter((deal) => deal.stage === 'Lost')
  const booked = totalBy(won, (deal) => deal.value) + totalBy(lost, (deal) => deal.value)
  const conversion = deals.length ? (won.length / deals.length) * 100 : 0
  const todayTasks = tasks.filter((task) => task.bucket === 'Today' && !task.done)
  const newLeads = leads.filter((lead) => lead.status === 'New')

  const revenueSeries = REVENUE_SERIES.find((item) => item.label === range) ?? REVENUE_SERIES[1]
  const labels = revenueSeries.labels

  const scaled = useMemo(() => {
    const resample = (values: number[], length: number) =>
      Array.from({ length }, (_, index) => {
        const position = length === 1 ? 0 : (index / (length - 1)) * (values.length - 1)
        const low = Math.floor(position)
        const high = Math.min(low + 1, values.length - 1)
        const mix = position - low
        return values[low] * (1 - mix) + values[high] * mix
      })
    return {
      revenue: resample(REVENUE_BASE, labels.length),
      won: resample(WON_BASE, labels.length),
      lost: resample(LOST_BASE, labels.length),
    }
  }, [labels.length])

  return (
    <section className="view" data-active="true">
      <div className="view-header">
        <div>
          <div className="view-title">Good morning, Ahmed</div>
          <div className="view-sub">Here&rsquo;s what&rsquo;s happening with your sales today.</div>
        </div>
        <div className="view-actions">
          <button className="btn btn-ghost" onClick={() => toast('Report exported to CSV')}>
            <Download />
            Export
          </button>
          <button className="btn btn-ghost" onClick={() => openCreate('lead')}>
            <Users />
            New lead
          </button>
          <button className="btn btn-primary" onClick={() => openCreate('deal')}>
            <Plus />
            New deal
          </button>
        </div>
      </div>

      <div className="bento">
        <div className="bento-card feature">
          <div className="kpi-label">
            Total revenue
            <span className="kpi-icon">
              <TrendingUp />
            </span>
          </div>
          <div className="kpi-value">{fmtMoney(booked)}</div>
          <span className="kpi-delta up">▲ 18.4%</span>
          <div className="kpi-note">vs last month</div>
          <Sparkline values={SPARK} />
        </div>

        <div className="bento-card">
          <div className="kpi-label">
            Open deals
            <span className="kpi-icon">
              <Activity />
            </span>
          </div>
          <div className="kpi-value">{open.length}</div>
          <div className="kpi-note">{fmtMoney(pipelineValue)} pipeline value</div>
        </div>

        <div className="bento-card">
          <div className="kpi-label">
            New leads
            <span className="kpi-icon">
              <Target />
            </span>
          </div>
          <div className="kpi-value">{126 + newLeads.length}</div>
          <span className="kpi-delta up">▲ 24.8%</span>
        </div>

        <div className="bento-card">
          <div className="kpi-label">
            Weighted forecast
            <span className="kpi-icon">
              <Sparkles />
            </span>
          </div>
          <div className="kpi-value">{fmtMoney(Math.round(weightedValue(deals)))}</div>
          <div className="kpi-note">{conversion.toFixed(1)}% conversion rate</div>
        </div>
      </div>

      <div className="two-col">
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="panel-head">
              <div className="panel-title">
                Revenue overview
                <small>Monthly recurring vs won/lost deals</small>
              </div>
              <Segmented
                options={REVENUE_SERIES.map((item) => ({ key: item.label, label: item.label }))}
                value={range}
                onChange={setRange}
              />
            </div>
            <div className="legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ background: BRAND.accentBlue }} />
                Revenue
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: BRAND.success }} />
                Deals won
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: BRAND.danger }} />
                Deals lost
              </div>
            </div>
            <div className="chart-wrap">
              <RevenueChart
                labels={labels}
                revenue={scaled.revenue}
                won={scaled.won}
                lost={scaled.lost}
              />
            </div>
          </div>

          <div className="card">
            <div className="panel-head">
              <div className="panel-title">
                Pipeline by stage
                <small>
                  {open.length} open deals · {fmtMoney(pipelineValue)} total
                </small>
              </div>
              <button className="chip" onClick={() => setView('deals')}>
                Open board
              </button>
            </div>
            <div className="pipe-mini">
              {STAGES.filter((stage) => stage.key !== 'Won' && stage.key !== 'Lost').map(
                (stage) => {
                  const rows = deals.filter((deal) => deal.stage === stage.key)
                  const sum = totalBy(rows, (deal) => deal.value)
                  const max = Math.max(
                    ...STAGES.map((item) =>
                      totalBy(
                        deals.filter((deal) => deal.stage === item.key),
                        (deal) => deal.value,
                      ),
                    ),
                    1,
                  )
                  return (
                    <div className="pipe-mini-col" key={stage.key}>
                      <div className="pipe-mini-head">
                        <span>{stage.key}</span>
                        <span>{rows.length}</span>
                      </div>
                      <div className="pipe-mini-bar">
                        <div
                          className="pipe-mini-fill"
                          style={{ width: `${(sum / max) * 100}%`, background: stage.color }}
                        />
                      </div>
                      <div className="pipe-mini-val">{fmtMoney(sum)}</div>
                    </div>
                  )
                },
              )}
            </div>
          </div>
        </div>

        <div className="card" style={{ maxHeight: 640, overflowY: 'auto' }}>
          <div className="panel-head">
            <div className="panel-title">Recent activity</div>
            <button className="chip" onClick={() => setView('activities')}>
              View all
            </button>
          </div>
          <div className="timeline">
            {activities.slice(0, 5).map((activity) => {
              const Icon = ACTIVITY_ICONS[activity.kind]
              return (
                <div className="tl-item" key={activity.id}>
                  <div className="tl-icon">
                    <Icon />
                  </div>
                  <div className="tl-body">
                    <div className="tl-text">
                      <RichBody parts={activity.text} />
                    </div>
                    <div className="tl-time">{activity.time}</div>
                  </div>
                </div>
              )
            })}
            <button className="btn btn-ghost btn-sm" onClick={() => setView('tasks')}>
              <CalendarClock />
              {todayTasks.length} tasks due today
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function RevenueChart({
  labels,
  revenue,
  won,
  lost,
}: {
  labels: readonly string[]
  revenue: number[]
  won: number[]
  lost: number[]
}) {
  const width = 680
  const height = 220
  const padX = 8
  const padTop = 16
  const padBottom = 26
  const max = Math.max(...revenue, ...won, ...lost) * 1.15
  const innerHeight = height - padTop - padBottom
  const step = (width - padX * 2) / Math.max(labels.length - 1, 1)

  const project = (values: number[]) =>
    values.map((value, index) => {
      const x = padX + index * step
      const y = padTop + innerHeight - (value / max) * innerHeight
      return { x, y }
    })

  const toPath = (points: { x: number; y: number }[]) =>
    points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ')

  const revenuePoints = project(revenue)
  const wonPoints = project(won)
  const lostPoints = project(lost)
  const baseline = padTop + innerHeight

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
      <defs>
        <linearGradient id="nexa-revenue" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={BRAND.accentBlue} stopOpacity={0.32} />
          <stop offset="1" stopColor={BRAND.accentBlue} stopOpacity={0} />
        </linearGradient>
        <linearGradient id="nexa-revenue-line" x1="0" x2="1">
          <stop offset="0" stopColor={BRAND.accentBlue} />
          <stop offset="1" stopColor={BRAND.accentViolet} />
        </linearGradient>
      </defs>

      {[0, 0.25, 0.5, 0.75, 1].map((stepValue) => (
        <line
          key={stepValue}
          x1={padX}
          x2={width - padX}
          y1={padTop + innerHeight * stepValue}
          y2={padTop + innerHeight * stepValue}
          stroke="var(--border)"
          strokeWidth={1}
        />
      ))}

      <path
        d={`${toPath(revenuePoints)} L${(padX + (labels.length - 1) * step).toFixed(1)} ${baseline} L${padX} ${baseline} Z`}
        fill="url(#nexa-revenue)"
      />
      <path
        d={toPath(revenuePoints)}
        fill="none"
        stroke="url(#nexa-revenue-line)"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={toPath(wonPoints)}
        fill="none"
        stroke={BRAND.success}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <path
        d={toPath(lostPoints)}
        fill="none"
        stroke={BRAND.danger}
        strokeWidth={1.8}
        strokeLinecap="round"
      />

      {labels.map((label, index) => (
        <text
          key={label}
          x={padX + index * step}
          y={height - 8}
          textAnchor="middle"
          fontSize={10}
          fill="var(--text-faint)"
        >
          {label}
        </text>
      ))}
    </svg>
  )
}
