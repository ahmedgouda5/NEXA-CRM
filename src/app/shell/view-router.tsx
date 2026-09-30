import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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

export function ViewRouter() {
  const setCommandOpen = useNavigationStore((state) => state.setCommandOpen)

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

  return (
    <Routes>
      <Route path="/" element={<OverviewView />} />
      <Route path="/inbox" element={<InboxView />} />
      <Route path="/contacts" element={<ContactsView />} />
      <Route path="/companies" element={<CompaniesView />} />
      <Route path="/leads" element={<LeadsView />} />
      <Route path="/deals" element={<DealsView />} />
      <Route path="/activities" element={<ActivitiesView />} />
      <Route path="/tasks" element={<TasksView />} />
      <Route path="/calendar" element={<CalendarView />} />
      <Route path="/reports" element={<ReportsView />} />
      <Route path="/automations" element={<AutomationsView />} />
      <Route path="/integrations" element={<IntegrationsView />} />
      {/* Fallback: redirect unknown paths to overview */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
