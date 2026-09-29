import { Mail, Move, Pencil, Plus, Target, Trophy } from 'lucide-react'
import { toast } from 'sonner'
import { useCrmStore } from '@/domains/crm/crm.store'
import type { AutomationIcon } from '@/domains/crm/crm.types'

const ICONS: Record<AutomationIcon, typeof Target> = {
  lead: Target,
  move: Move,
  mail: Mail,
  note: Pencil,
  win: Trophy,
  edit: Pencil,
}

export function AutomationsView() {
  const automations = useCrmStore((state) => state.automations)
  const toggleAutomation = useCrmStore((state) => state.toggleAutomation)
  const active = automations.filter((automation) => automation.on).length

  return (
    <section className="view" data-active="true">
      <div className="view-header">
        <div>
          <div className="view-title">Automations</div>
          <div className="view-sub">Let NEXA handle the busywork</div>
        </div>
        <div className="view-actions">
          <span className="cell-sub">
            {active} of {automations.length} running
          </span>
          <button
            className="btn btn-primary"
            onClick={() => toast('Automation builder opened')}
          >
            <Plus />
            New automation
          </button>
        </div>
      </div>

      <div className="simple-card-grid">
        {automations.map((automation) => {
          const Icon = ICONS[automation.icon]
          return (
            <div className="tool-card" key={automation.id}>
              <div className="tool-card-top">
                <div className="tool-icon">
                  <Icon />
                </div>
                <h4>{automation.name}</h4>
                <button
                  type="button"
                  className={automation.on ? 'toggle on' : 'toggle'}
                  aria-pressed={automation.on}
                  aria-label={`Toggle ${automation.name}`}
                  onClick={() => {
                    toggleAutomation(automation.id)
                    toast(`${automation.name} ${automation.on ? 'paused' : 'enabled'}`)
                  }}
                />
              </div>
              <p>{automation.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
