import { useEffect } from 'react'
import { useNavigationStore } from '@/domains/navigation'
import { ActivitiesView } from '@/domains/crm/activities/components/activities-view'
import { CalendarView } from '@/domains/crm/calendar/components/calendar-view'
import { AutomationsView } from '@/domains/crm/automations/components/automations-view'
import { CompaniesView } from '@/domains/crm/companies/components/companies-view'
import { ContactsView } from '@/domains/crm/contacts/components/contacts-view'
import { DealsView } from '@/domains/crm/deals/components/deals-view'
import { InboxView } from '@/domains/crm/inbox/components/inbox-view'
import { IntegrationsView } from '@/domains/crm/integrations/components/integrations-view'
import { LeadsView } from '@/domains/crm/leads/components/leads-view'
import { OverviewView } from '@/domains/crm/overview/components/overview-view'
import { ReportsView } from '@/domains/crm/reports/components/reports-view'
import { TasksView } from '@/domains/crm/tasks/components/tasks-view'

const VIEWS = {
  overview: OverviewView,
  inbox: InboxView,
  contacts: ContactsView,
  companies: CompaniesView,
  leads: LeadsView,
  deals: DealsView,
  activities: ActivitiesView,
  tasks: TasksView,
  calendar: CalendarView,
  reports: ReportsView,
  automations: AutomationsView,
  integrations: IntegrationsView,
} as const

export function ViewRouter() {
  const activeView = useNavigationStore((state) => state.activeView)
  const setCommandOpen = useNavigationStore((state) => state.setCommandOpen)
  const Active = VIEWS[activeView]

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setCommandOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setCommandOpen])

  return <Active />
}
