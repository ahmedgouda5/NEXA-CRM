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
      { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/' },
      { id: 'inbox', label: 'Inbox', icon: Inbox, path: '/inbox', badge: '4' },
      { id: 'contacts', label: 'Contacts', icon: Users, path: '/contacts' },
      { id: 'companies', label: 'Companies', icon: Building, path: '/companies' },
    ],
  },
  {
    label: 'Sales',
    items: [
      { id: 'leads', label: 'Leads', icon: Target, path: '/leads', badge: '5' },
      { id: 'deals', label: 'Pipeline', icon: Kanban, path: '/deals' },
    ],
  },
  {
    label: 'Productivity',
    items: [
      { id: 'activities', label: 'Activity', icon: Activity, path: '/activities' },
      { id: 'tasks', label: 'Tasks', icon: SquareCheck, path: '/tasks', badge: '3' },
      { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/calendar' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { id: 'reports', label: 'Reports', icon: ChartColumn, path: '/reports' },
      { id: 'automations', label: 'Automations', icon: Workflow, path: '/automations' },
      { id: 'integrations', label: 'Integrations', icon: Plug, path: '/integrations' },
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

/** Lookup from path → ViewId, used anywhere that needs to know the current view from the URL. */
export const VIEW_PATHS: Record<string, ViewId> = {
  '/': 'overview',
  '/inbox': 'inbox',
  '/contacts': 'contacts',
  '/companies': 'companies',
  '/leads': 'leads',
  '/deals': 'deals',
  '/activities': 'activities',
  '/tasks': 'tasks',
  '/calendar': 'calendar',
  '/reports': 'reports',
  '/automations': 'automations',
  '/integrations': 'integrations',
}
