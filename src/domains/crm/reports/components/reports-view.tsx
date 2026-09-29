import { useState } from 'react'
import { Download, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { fmtMoney } from '@/shared/lib/format'
import { BRAND } from '@/shared/theme/theme'
import { Segmented } from '@/domains/crm/components/crm-primitives'
import {
  FUNNEL_STAGES,
  LEAD_SOURCES,
  REPORT_LOST,
  REPORT_MONTHS,
  REPORT_WON,
} from '@/domains/crm/crm.data'
import { useCrmStore } from '@/domains/crm/crm.store'
import { openPipeline, totalBy, weightedValue } from '@/domains/crm/crm.utils'

type Range = '7d' | '30d' | '90d'

export function ReportsView() {
  const deals = useCrmStore((state) => state.deals)
  const [range, setRange] = useState<Range>('30d')
  const open = openPipeline(deals)
  const won = deals.filter((deal) => deal.stage === 'Won')
  const lost = deals.filter((deal) => deal.stage === 'Lost')
  const decided = won.length + lost.length
  const winRate = decided ? (won.length / decided) * 100 : 0
  const avg = deals.length ? totalBy(deals, (deal) => deal.value) / deals.length : 0

  return (
    <section className="view" data-active="true">
      <div className="view-header">
        <div>
          <div className="view-title">Reports</div>
          <div className="view-sub">Sales performance across your team</div>
        </div>
        <div className="view-actions">
          <Segmented
            options={[
              { key: '7d', label: '7 days' },
              { key: '30d', label: 'Last 30 days' },
              { key: '90d', label: 'Last 90 days' },
            ]}
            value={range}
            onChange={setRange}
          />
          <button className="btn btn-ghost" onClick={() => toast('Report exported to CSV')}>
            <Download />
            Export
          </button>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-stat">
          <div className="k">Pipeline value</div>
          <div className="v">{fmtMoney(totalBy(open, (deal) => deal.value))}</div>
        </div>
        <div className="report-stat">
          <div className="k">Win rate</div>
          <div className="v">{winRate.toFixed(1)}%</div>
        </div>
        <div className="report-stat">
          <div className="k">Avg deal size</div>
          <div className="v">{fmtMoney(Math.round(avg))}</div>
        </div>
        <div className="report-stat">
          <div className="k">Weighted forecast</div>
          <div className="v">{fmtMoney(Math.round(weightedValue(deals)))}</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="card">
          <div className="panel-head">
            <div className="panel-title">
              Deals won vs lost
              <small>Last 6 months</small>
            </div>
            <div className="legend" style={{ padding: 0 }}>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: BRAND.success }} />
                Won
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: BRAND.danger }} />
                Lost
              </div>
            </div>
          </div>
          <div className="chart-wrap">
            <GroupedBars />
          </div>
        </div>

        <div className="card">
          <div className="panel-head">
            <div className="panel-title">
              Lead sources
              <small>126 leads generated</small>
            </div>
          </div>
          <div className="chart-wrap" style={{ display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'center' }}>
            <Donut />
            <div>
              {LEAD_SOURCES.map((source) => (
                <div className="legend-item" key={source.label} style={{ marginBottom: 8 }}>
                  <span className="legend-dot" style={{ background: source.color }} />
                  {source.label} · {source.value}%
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ gridColumn: '1/-1' }}>
          <div className="panel-head">
            <div className="panel-title">
              Conversion funnel
              <small>Lead → Won</small>
            </div>
            <span className="chip">
              <TrendingUp />
              {(FUNNEL_STAGES[0].value / FUNNEL_STAGES[FUNNEL_STAGES.length - 1].value * 100).toFixed(1)}%
              overall
            </span>
          </div>
          <div className="chart-wrap">
            {FUNNEL_STAGES.map((stage) => {
              const max = FUNNEL_STAGES[0].value
              return (
                <div className="funnel-row" key={stage.label}>
                  <div className="funnel-label">{stage.label}</div>
                  <div className="funnel-bar" style={{ width: `${(stage.value / max) * 100}%` }}>
                    {stage.value}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function GroupedBars() {
  const width = 400
  const height = 200
  const padBottom = 26
  const padTop = 12
  const groupCount = REPORT_WON.length
  const groupWidth = width / groupCount
  const barWidth = 14
  const gap = 6
  const max = Math.max(...REPORT_WON, ...REPORT_LOST) * 1.2
  const inner = height - padBottom - padTop

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
      {[0, 0.5, 1].map((value) => (
        <line
          key={value}
          x1={0}
          x2={width}
          y1={padTop + inner * value}
          y2={padTop + inner * value}
          stroke="var(--border)"
        />
      ))}
      {REPORT_WON.map((value, index) => {
        const x = index * groupWidth + (groupWidth - barWidth * 2 - gap) / 2
        const wonHeight = (value / max) * inner
        const lostHeight = (REPORT_LOST[index] / max) * inner
        return (
          <g key={REPORT_MONTHS[index]}>
            <rect
              x={x}
              y={padTop + inner - wonHeight}
              width={barWidth}
              height={wonHeight}
              rx={3}
              fill={BRAND.success}
            />
            <rect
              x={x + barWidth + gap}
              y={padTop + inner - lostHeight}
              width={barWidth}
              height={lostHeight}
              rx={3}
              fill={BRAND.danger}
            />
            <text
              x={x + barWidth + gap / 2}
              y={height - 8}
              textAnchor="middle"
              fontSize={10}
              fill="var(--text-faint)"
            >
              {REPORT_MONTHS[index]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function Donut() {
  const size = 160
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const total = LEAD_SOURCES.reduce((sum, source) => sum + source.value, 0)
  let offset = 0

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <g transform={`translate(${size / 2} ${size / 2}) rotate(-90)`}>
        {LEAD_SOURCES.map((source) => {
          const length = (source.value / total) * circumference
          const dash = `${length} ${circumference - length}`
          const element = (
            <circle
              key={source.label}
              r={radius}
              cx={0}
              cy={0}
              fill="none"
              stroke={source.color}
              strokeWidth={26}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
            />
          )
          offset += length
          return element
        })}
      </g>
      <text
        x={size / 2}
        y={size / 2 + 6}
        textAnchor="middle"
        fontSize={20}
        fontWeight={700}
        fill="var(--text)"
      >
        126
      </text>
    </svg>
  )
}
