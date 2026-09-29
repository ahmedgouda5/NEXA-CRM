import {
  Activity,
  Building,
  Calendar,
  ChartColumn,
  Inbox,
  Kanban,
  LayoutDashboard,
  Plug,
  SquareCheck,
  Target,
  Users,
  Workflow,
} from 'lucide-react'
import type { NavGroup, ViewId } from './navigation.types'

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Workspace',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'inbox', label: 'Inbox', icon: Inbox, badge: '4' },
      { id: 'contacts', label: 'Contacts', icon: Users },
      { id: 'companies', label: 'Companies', icon: Building },
    ],
  },
  {
    label: 'Sales',
    items: [
      { id: 'leads', label: 'Leads', icon: Target, badge: '5' },
      { id: 'deals', label: 'Pipeline', icon: Kanban },
    ],
  },
  {
    label: 'Productivity',
    items: [
      { id: 'activities', label: 'Activity', icon: Activity },
      { id: 'tasks', label: 'Tasks', icon: SquareCheck, badge: '3' },
      { id: 'calendar', label: 'Calendar', icon: Calendar },
    ],
  },
  {
    label: 'Insights',
    items: [
      { id: 'reports', label: 'Reports', icon: ChartColumn },
      { id: 'automations', label: 'Automations', icon: Workflow },
      { id: 'integrations', label: 'Integrations', icon: Plug },
    ],
  },
]

export const VIEW_TITLES: Record<ViewId, { title: string; sub: string }> = {
  overview: {
    title: 'Good morning, Ahmed',
    sub: "Here's what's happening across your pipeline today.",
  },
  inbox: { title: 'Inbox', sub: 'Customer messages, mentions and team threads in one place.' },
  contacts: { title: 'Contacts', sub: 'Everyone you work with, searchable and sortable.' },
  companies: { title: 'Companies', sub: 'Accounts, open pipeline value and account health.' },
  leads: { title: 'Leads', sub: 'Inbound and outbound prospects ranked by intent score.' },
  deals: { title: 'Pipeline', sub: 'Drag deals between stages to keep your forecast honest.' },
  activities: { title: 'Activity', sub: 'Everything that happened across the workspace.' },
  tasks: { title: 'Tasks', sub: 'What needs doing today, and what slipped.' },
  calendar: { title: 'Calendar', sub: 'Meetings, calls and deadlines for the month.' },
  reports: { title: 'Reports', sub: 'Revenue, conversion and forecast performance.' },
  automations: { title: 'Automations', sub: 'Rules that run the busywork for you.' },
  integrations: { title: 'Integrations', sub: 'Connect the tools your team already lives in.' },
}

export const PRIMARY_NAV_IDS: ViewId[] = [
  'overview',
  'inbox',
  'contacts',
  'companies',
  'leads',
  'deals',
  'activities',
  'tasks',
  'calendar',
  'reports',
  'automations',
  'integrations',
]
