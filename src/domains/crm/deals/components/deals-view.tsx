import { useState } from 'react'
import { CalendarClock, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { fmtMoney } from '@/shared/lib/format'
import { AvatarChip, CompanyMark, MiniSearch } from '@/domains/crm/components/crm-primitives'
import { STAGES } from '@/domains/crm/crm.data'
import { useCrmStore } from '@/domains/crm/crm.store'
import type { Deal, DealStage } from '@/domains/crm/crm.types'
import { matches, openPipeline, totalBy, weightedValue } from '@/domains/crm/crm.utils'

const BOARD_STAGES: DealStage[] = STAGES.map((stage) => stage.key)

export function DealsView() {
  const deals = useCrmStore((state) => state.deals)
  const openCreate = useCrmStore((state) => state.openCreate)
  const openDeal = useCrmStore((state) => state.openDeal)
  const moveDeal = useCrmStore((state) => state.moveDeal)
  const [query, setQuery] = useState('')
  const [dragging, setDragging] = useState<string | null>(null)
  const [overStage, setOverStage] = useState<DealStage | null>(null)

  const visible = deals.filter((deal) => matches(`${deal.name} ${deal.company}`, query))
  const open = openPipeline(deals)

  function onDrop(stage: DealStage) {
    if (dragging) {
      moveDeal(dragging, stage)
      const deal = deals.find((item) => item.id === dragging)
      toast.success(`${deal?.name ?? 'Deal'} moved to ${stage}`)
    }
    setDragging(null)
    setOverStage(null)
  }

  return (
    <section className="view" data-active="true">
      <div className="view-header">
        <div>
          <div className="view-title">Sales pipeline</div>
          <div className="view-sub">
            {open.length} open deals · {fmtMoney(totalBy(open, (deal) => deal.value))} total ·{' '}
            {fmtMoney(Math.round(weightedValue(deals)))} weighted
          </div>
        </div>
        <div className="view-actions">
          <MiniSearch value={query} onChange={setQuery} placeholder="Filter deals…" />
          <button className="btn btn-primary" onClick={() => openCreate('deal')}>
            <Plus />
            New deal
          </button>
        </div>
      </div>

      <div className="kanban-wrap">
        {BOARD_STAGES.map((stage) => {
          const meta = STAGES.find((item) => item.key === stage)
          const rows = visible.filter((deal) => deal.stage === stage)
          const sum = totalBy(rows, (deal) => deal.value)
          return (
            <div
              className="kanban-col"
              key={stage}
              data-dragover={overStage === stage ? 'true' : 'false'}
              onDragOver={(event) => {
                event.preventDefault()
                setOverStage(stage)
              }}
              onDragLeave={() => setOverStage((prev) => (prev === stage ? null : prev))}
              onDrop={() => onDrop(stage)}
            >
              <div className="kanban-col-head">
                <div className="kanban-col-title">
                  <span className="stage-dot" style={{ background: meta?.color }} />
                  {stage}
                </div>
                <span className="kanban-col-count">{rows.length}</span>
              </div>
              <div className="kanban-col-sum">{fmtMoney(sum)}</div>
              <div className="kanban-cards">
                {rows.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    dragging={dragging === deal.id}
                    onOpen={() => openDeal(deal.id)}
                    onDragStart={() => setDragging(deal.id)}
                    onDragEnd={() => {
                      setDragging(null)
                      setOverStage(null)
                    }}
                  />
                ))}
                {rows.length === 0 ? (
                  <div className="empty-state" style={{ padding: 18, fontSize: 11.5 }}>
                    Drop a deal here
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function DealCard({
  deal,
  dragging,
  onOpen,
  onDragStart,
  onDragEnd,
}: {
  deal: Deal
  dragging: boolean
  onOpen: () => void
  onDragStart: () => void
  onDragEnd: () => void
}) {
  return (
    <article
      className="deal-card"
      draggable
      data-dragging={dragging ? 'true' : 'false'}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="deal-card-top">
        <CompanyMark name={deal.company} />
        <div className="deal-company">{deal.company}</div>
      </div>
      <div className="deal-name">{deal.name}</div>
      <div className="deal-meta-row">
        <span className="deal-value">{fmtMoney(deal.value)}</span>
        <span className="deal-prob">{deal.prob}%</span>
      </div>
      <div className="deal-card-foot">
        <div className="deal-owner">
          <AvatarChip seed={deal.owner} name={deal.owner} size="sm" className="deal-owner-av" />
          {deal.next}
        </div>
        <div className={deal.due === '—' ? 'deal-due' : 'deal-due soon'}>
          <CalendarClock />
          {deal.due}
        </div>
      </div>
    </article>
  )
}
