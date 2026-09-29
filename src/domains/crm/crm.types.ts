export type ContactStatus = 'Active' | 'Lead' | 'Inactive'

export type CompanyHealth = 'Healthy' | 'At risk' | 'Needs attention'

export type DealStage = 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost'

export type TaskPriority = 'High' | 'Medium' | 'Low'

export type TaskBucket = 'Today' | 'Upcoming' | 'Overdue' | 'Completed'

export type LeadStatus = 'New' | 'Contacted' | 'Qualified'

export type LeadSource =
  | 'Website form'
  | 'Referral'
  | 'LinkedIn'
  | 'Webinar'
  | 'Cold outreach'

export type ActivityKind =
  | 'edit'
  | 'lead'
  | 'move'
  | 'mail'
  | 'check'
  | 'call'
  | 'win'
  | 'note'

export type CalendarEventKind = 'meeting' | 'call' | 'followup' | 'deadline'

export type InboxCategory = 'all' | 'customers' | 'mentions' | 'internal'

export type AutomationIcon = 'lead' | 'move' | 'mail' | 'note' | 'win' | 'edit'

export type RichText = { text: string; strong?: boolean }[]

export type Contact = {
  id: string
  name: string
  title: string
  company: string
  email: string
  phone: string
  status: ContactStatus
  owner: string
  lastActivity: string
  dealValue: number
}

export type Company = {
  id: string
  name: string
  industry: string
  owner: string
  openDeals: number
  value: number
  contacts: number
  health: CompanyHealth
}

export type Deal = {
  id: string
  name: string
  company: string
  value: number
  prob: number
  stage: DealStage
  owner: string
  next: string
  due: string
}

export type Task = {
  id: string
  title: string
  company: string
  priority: TaskPriority
  due: string
  owner: string
  bucket: Exclude<TaskBucket, 'Completed'>
  done: boolean
}

export type Lead = {
  id: string
  name: string
  source: LeadSource
  company: string
  score: number
  status: LeadStatus
  created: string
}

export type Activity = {
  id: string
  time: string
  group: string
  kind: ActivityKind
  text: RichText
}

export type CalendarEvent = {
  id: string
  day: number
  title: string
  kind: CalendarEventKind
}

export type ThreadMessage = {
  id: string
  from: string
  time: string
  body: RichText
  own: boolean
}

export type Conversation = {
  id: string
  name: string
  company: string
  subject: string
  preview: string
  time: string
  unread: boolean
  cat: InboxCategory
  body: RichText
  messages: ThreadMessage[]
}

export type Automation = {
  id: string
  name: string
  desc: string
  icon: AutomationIcon
  on: boolean
}

export type Integration = {
  id: string
  name: string
  desc: string
  connected: boolean
}

export type Notification = {
  id: string
  text: RichText
  time: string
  read: boolean
  tone: 'info' | 'success' | 'warning'
}

export type Message = {
  id: string
  name: string
  preview: string
  time: string
  read: boolean
}
