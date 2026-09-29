import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { useCrmStore } from '@/domains/crm/crm.store'
import type { CalendarEvent } from '@/domains/crm/crm.types'

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const EVENT_CLASS: Record<CalendarEvent['kind'], string> = {
  meeting: 'ev-meeting',
  call: 'ev-call',
  followup: 'ev-followup',
  deadline: 'ev-deadline',
}

const MONTH_DAYS = 31
const LEADING_BLANKS = 6

export function CalendarView() {
  const events = useCrmStore((state) => state.events)
  const today = 9

  const cells: { day: number | null; events: CalendarEvent[] }[] = [
    ...Array.from({ length: LEADING_BLANKS }, () => ({ day: null, events: [] })),
    ...Array.from({ length: MONTH_DAYS }, (_, index) => {
      const day = index + 1
      return { day, events: events.filter((event) => event.day === day) }
    }),
  ]

  while (cells.length % 7 !== 0) cells.push({ day: null, events: [] })

  return (
    <section className="view" data-active="true">
      <div className="view-header">
        <div>
          <div className="view-title">Calendar</div>
          <div className="view-sub">August 2026</div>
        </div>
        <div className="view-actions">
          <div className="legend" style={{ padding: 0 }}>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#8CA9FF' }} />
              Meetings
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#5FE0B4' }} />
              Calls
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#F5B94A' }} />
              Follow-ups
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#F98A91' }} />
              Deadlines
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => toast('Previous month')}>
            <ChevronLeft />
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => toast('Next month')}>
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="card">
        <div className="cal-grid">
          {DOW.map((day) => (
            <div className="cal-dow" key={day}>
              {day}
            </div>
          ))}
          {cells.map((cell, index) => (
            <div
              className={
                cell.day === null
                  ? 'cal-cell other'
                  : cell.day === today
                    ? 'cal-cell today'
                    : 'cal-cell'
              }
              key={`${cell.day ?? 'blank'}-${index}`}
            >
              {cell.day ? <div className="cal-daynum">{cell.day}</div> : null}
              {cell.events.map((event) => (
                <div
                  className={`cal-event ${EVENT_CLASS[event.kind]}`}
                  key={event.id}
                  title={event.title}
                  onClick={() => toast(event.title)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(keyEvent) => {
                    if (keyEvent.key === 'Enter') toast(event.title)
                  }}
                >
                  {event.title}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
