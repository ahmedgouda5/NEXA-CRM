import { create } from 'zustand'
import {
  ACTIVITY_SEED,
  AUTOMATION_SEED,
  CALENDAR_SEED,
  COMPANY_SEED,
  CONVERSATION_SEED,
  CONTACT_SEED,
  DEAL_SEED,
  INTEGRATION_SEED,
  LEAD_SEED,
  MESSAGE_SEED,
  NOTIFICATION_SEED,
  TASK_SEED,
} from './crm.data'
import type {
  Activity,
  Automation,
  CalendarEvent,
  Company,
  Contact,
  Conversation,
  Deal,
  DealStage,
  InboxCategory,
  Integration,
  Lead,
  Message,
  Notification,
  Task,
  TaskBucket,
  ThreadMessage,
} from './crm.types'
import type { DealFormValues } from './contacts/contact.schema'

export type CreateKind = 'contact' | 'deal' | 'company' | 'lead' | 'task' | null

type CrmState = {
  contacts: Contact[]
  companies: Company[]
  deals: Deal[]
  tasks: Task[]
  leads: Lead[]
  activities: Activity[]
  events: CalendarEvent[]
  conversations: Conversation[]
  automations: Automation[]
  integrations: Integration[]
  notifications: Notification[]
  messages: Message[]
  activeConversationId: string | null
  inboxCategory: InboxCategory
  taskBucket: TaskBucket
  openContactId: string | null
  openDealId: string | null
  createKind: CreateKind
  addContact: (values: {
    firstName: string
    lastName: string
    company: string
    email: string
    phone: string
    owner: string
  }) => void
  addDeal: (values: DealFormValues) => void
  addCompany: (values: { name: string; industry: string; owner: string }) => void
  addLead: (values: { name: string; company: string; source: Lead['source'] }) => void
  addTask: (values: { title: string; company: string; priority: Task['priority']; due: string }) => void
  moveDeal: (dealId: string, stage: DealStage) => void
  toggleTask: (taskId: string) => void
  toggleAutomation: (id: string) => void
  toggleIntegration: (id: string) => void
  setInboxCategory: (category: InboxCategory) => void
  openConversation: (id: string) => void
  closeConversation: () => void
  replyToConversation: (body: string) => void
  setTaskBucket: (bucket: TaskBucket) => void
  openContact: (id: string | null) => void
  openDeal: (id: string | null) => void
  openCreate: (kind: CreateKind) => void
  markNotificationsRead: () => void
  markMessagesRead: () => void
}

let sequence = 100

function nextId(prefix: string) {
  sequence += 1
  return `${prefix}${sequence}`
}

export const useCrmStore = create<CrmState>((set) => ({
  contacts: CONTACT_SEED,
  companies: COMPANY_SEED,
  deals: DEAL_SEED,
  tasks: TASK_SEED,
  leads: LEAD_SEED,
  activities: ACTIVITY_SEED,
  events: CALENDAR_SEED,
  conversations: CONVERSATION_SEED,
  automations: AUTOMATION_SEED,
  integrations: INTEGRATION_SEED,
  notifications: NOTIFICATION_SEED,
  messages: MESSAGE_SEED,
  activeConversationId: null,
  inboxCategory: 'customers',
  taskBucket: 'Today',
  openContactId: null,
  openDealId: null,
  createKind: null,

  addContact: (values) =>
    set((state) => {
      const contact: Contact = {
        id: nextId('c'),
        name: `${values.firstName} ${values.lastName}`,
        title: 'New contact',
        company: values.company,
        email: values.email,
        phone: values.phone,
        status: 'Lead',
        owner: values.owner,
        lastActivity: 'Just now',
        dealValue: 0,
      }
      return {
        contacts: [contact, ...state.contacts],
        companies: state.companies.map((company) =>
          company.name === values.company
            ? { ...company, contacts: company.contacts + 1 }
            : company,
        ),
      }
    }),

  addDeal: (values) =>
    set((state) => ({
      deals: [
        {
          id: nextId('d'),
          name: values.name,
          company: values.company,
          value: values.value,
          prob: values.prob,
          stage: values.stage,
          owner: values.owner,
          next: 'Schedule next step',
          due: 'Aug 20',
        },
        ...state.deals,
      ],
    })),

  addCompany: (values) =>
    set((state) => ({
      companies: [
        {
          id: nextId('co'),
          name: values.name,
          industry: values.industry,
          owner: values.owner,
          openDeals: 0,
          value: 0,
          contacts: 0,
          health: 'Healthy',
        },
        ...state.companies,
      ],
    })),

  addLead: (values) =>
    set((state) => ({
      leads: [
        {
          id: nextId('l'),
          name: values.name,
          source: values.source,
          company: values.company,
          score: 50,
          status: 'New',
          created: 'Just now',
        },
        ...state.leads,
      ],
    })),

  addTask: (values) =>
    set((state) => ({
      tasks: [
        {
          id: nextId('t'),
          title: values.title,
          company: values.company,
          priority: values.priority,
          due: values.due,
          owner: 'Ahmed Gouda',
          bucket: 'Today',
          done: false,
        },
        ...state.tasks,
      ],
    })),

  moveDeal: (dealId, stage) =>
    set((state) => ({
      deals: state.deals.map((deal) => (deal.id === dealId ? { ...deal, stage } : deal)),
    })),

  toggleTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task,
      ),
    })),

  toggleAutomation: (id) =>
    set((state) => ({
      automations: state.automations.map((automation) =>
        automation.id === id ? { ...automation, on: !automation.on } : automation,
      ),
    })),

  toggleIntegration: (id) =>
    set((state) => ({
      integrations: state.integrations.map((integration) =>
        integration.id === id ? { ...integration, connected: !integration.connected } : integration,
      ),
    })),

  setInboxCategory: (inboxCategory) => set({ inboxCategory }),

  openConversation: (id) =>
    set((state) => ({
      activeConversationId: id,
      conversations: state.conversations.map((conversation) =>
        conversation.id === id ? { ...conversation, unread: false } : conversation,
      ),
    })),

  closeConversation: () => set({ activeConversationId: null }),

  replyToConversation: (body) =>
    set((state) => {
      const id = state.activeConversationId
      if (!id) return state
      const message: ThreadMessage = {
        id: nextId('m'),
        from: 'You',
        time: 'Just now',
        own: true,
        body: [{ text: body }],
      }
      return {
        conversations: state.conversations.map((conversation) =>
          conversation.id === id
            ? {
                ...conversation,
                preview: body,
                time: 'Just now',
                messages: [...conversation.messages, message],
              }
            : conversation,
        ),
      }
    }),

  setTaskBucket: (taskBucket) => set({ taskBucket }),
  openContact: (openContactId) => set({ openContactId }),
  openDeal: (openDealId) => set({ openDealId }),
  openCreate: (createKind) => set({ createKind }),

  markNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
    })),

  markMessagesRead: () =>
    set((state) => ({
      messages: state.messages.map((message) => ({ ...message, read: true })),
    })),
}))

export function useConversation(id: string | null) {
  return useCrmStore((state) => state.conversations.find((item) => item.id === id))
}
