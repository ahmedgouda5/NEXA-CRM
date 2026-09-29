import { Check, Mail, Move, Pencil, Phone, Target, Trophy } from 'lucide-react'
import { RichBody } from '@/domains/crm/components/crm-primitives'
import { useCrmStore } from '@/domains/crm/crm.store'
import type { ActivityKind } from '@/domains/crm/crm.types'

const ICONS: Record<ActivityKind, typeof Pencil> = {
  edit: Pencil,
  lead: Target,
  move: Move,
  mail: Mail,
  check: Check,
  call: Phone,
  win: Trophy,
  note: Pencil,
}

export function ActivitiesView() {
  const activities = useCrmStore((state) => state.activities)
  const groups: { label: string; items: typeof activities }[] = []
  for (const activity of activities) {
    const last = groups[groups.length - 1]
    if (last && last.label === activity.group) last.items.push(activity)
    else groups.push({ label: activity.group, items: [activity] })
  }

  return (
    <section className="view" data-active="true">
      <div className="view-header">
        <div>
          <div className="view-title">Activities</div>
          <div className="view-sub">Every touchpoint across your team</div>
        </div>
        <div className="view-actions">
          <span className="cell-sub">{activities.length} events</span>
        </div>
      </div>

      <div className="card">
        <div className="timeline" style={{ paddingTop: 16 }}>
          {groups.map((group) => (
            <div key={group.label}>
              <div className="tl-group-label">{group.label}</div>
              {group.items.map((activity) => {
                const Icon = ICONS[activity.kind]
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
