import type { LucideIcon } from 'lucide-react'

export type ViewId =
  | 'overview'
  | 'inbox'
  | 'contacts'
  | 'companies'
  | 'leads'
  | 'deals'
  | 'activities'
  | 'tasks'
  | 'calendar'
  | 'reports'
  | 'automations'
  | 'integrations'

export type NavItem = {
  id: ViewId
  label: string
  icon: LucideIcon
  badge?: string
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export type FavoriteRef = {
  id: string
  label: string
  kind: 'contact' | 'company' | 'deal'
  view: ViewId
}
