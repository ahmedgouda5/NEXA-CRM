import type {
  Activity,
  Automation,
  CalendarEvent,
  Company,
  Contact,
  Conversation,
  Deal,
  DealStage,
  Integration,
  Lead,
  Message,
  Notification,
  Task,
} from './crm.types'

export const OWNERS = ['Ahmed Gouda', 'Sarah Johnson', 'Mike Chen'] as const

export const STAGES: readonly { key: DealStage; color: string }[] = [
  { key: 'Lead', color: '#6E7079' },
  { key: 'Qualified', color: '#4C7DFF' },
  { key: 'Proposal', color: '#8B6CFF' },
  { key: 'Negotiation', color: '#F5B94A' },
  { key: 'Won', color: '#2FD498' },
  { key: 'Lost', color: '#F2555F' },
]

export const COMPANY_SEED: Company[] = [
  {
    id: 'acme',
    name: 'Acme Corporation',
    industry: 'Manufacturing',
    owner: 'Ahmed Gouda',
    openDeals: 4,
    value: 64200,
    contacts: 6,
    health: 'Healthy',
  },
  {
    id: 'nova',
    name: 'Nova Labs',
    industry: 'Biotech',
    owner: 'Sarah Johnson',
    openDeals: 2,
    value: 21800,
    contacts: 3,
    health: 'At risk',
  },
  {
    id: 'bright',
    name: 'Bright Analytics',
    industry: 'Data & Analytics',
    owner: 'Mike Chen',
    openDeals: 1,
    value: 18200,
    contacts: 2,
    health: 'Healthy',
  },
  {
    id: 'cedar',
    name: 'Cedar & Co.',
    industry: 'Retail',
    owner: 'Ahmed Gouda',
    openDeals: 3,
    value: 15400,
    contacts: 4,
    health: 'Healthy',
  },
  {
    id: 'orbit',
    name: 'Orbit Freight',
    industry: 'Logistics',
    owner: 'Sarah Johnson',
    openDeals: 1,
    value: 9600,
    contacts: 2,
    health: 'Needs attention',
  },
  {
    id: 'lumen',
    name: 'Lumen Studio',
    industry: 'Creative Agency',
    owner: 'Mike Chen',
    openDeals: 2,
    value: 12700,
    contacts: 3,
    health: 'Healthy',
  },
]

const CONTACT_CORE: Contact[] = [
  {
    id: 'c1',
    name: 'Sarah Johnson',
    title: 'VP of Sales',
    company: 'Acme Corporation',
    email: 'sarah@acme.com',
    phone: '+1 555 231 441',
    status: 'Active',
    owner: 'Ahmed Gouda',
    lastActivity: '2h ago',
    dealValue: 24500,
  },
  {
    id: 'c2',
    name: 'Michael Brown',
    title: 'Head of Growth',
    company: 'Nova Labs',
    email: 'michael@novalabs.com',
    phone: '+1 555 821 912',
    status: 'Lead',
    owner: 'Sarah Johnson',
    lastActivity: '1d ago',
    dealValue: 12800,
  },
  {
    id: 'c3',
    name: 'Elena Petrova',
    title: 'Procurement Lead',
    company: 'Bright Analytics',
    email: 'elena@brightanalytics.io',
    phone: '+1 555 442 190',
    status: 'Active',
    owner: 'Mike Chen',
    lastActivity: '3h ago',
    dealValue: 18200,
  },
  {
    id: 'c4',
    name: 'James Okafor',
    title: 'Founder',
    company: 'Cedar & Co.',
    email: 'james@cedarco.com',
    phone: '+1 555 552 330',
    status: 'Active',
    owner: 'Ahmed Gouda',
    lastActivity: '5h ago',
    dealValue: 15400,
  },
  {
    id: 'c5',
    name: 'Priya Nair',
    title: 'Ops Director',
    company: 'Orbit Freight',
    email: 'priya@orbitfreight.com',
    phone: '+1 555 903 221',
    status: 'Inactive',
    owner: 'Sarah Johnson',
    lastActivity: '6d ago',
    dealValue: 9600,
  },
  {
    id: 'c6',
    name: 'Tom Richter',
    title: 'Creative Director',
    company: 'Lumen Studio',
    email: 'tom@lumenstudio.co',
    phone: '+1 555 774 552',
    status: 'Lead',
    owner: 'Mike Chen',
    lastActivity: '2d ago',
    dealValue: 6200,
  },
  {
    id: 'c7',
    name: 'Isabella Cruz',
    title: 'CFO',
    company: 'Acme Corporation',
    email: 'isabella@acme.com',
    phone: '+1 555 118 007',
    status: 'Active',
    owner: 'Ahmed Gouda',
    lastActivity: '1h ago',
    dealValue: 39700,
  },
  {
    id: 'c8',
    name: 'David Kim',
    title: 'CTO',
    company: 'Nova Labs',
    email: 'david@novalabs.com',
    phone: '+1 555 662 448',
    status: 'Lead',
    owner: 'Sarah Johnson',
    lastActivity: '4d ago',
    dealValue: 9000,
  },
]

const SURNAMES = ['Lee', 'Adams', 'Novak', 'Reyes', 'Silva']
const STATUSES: Contact['status'][] = ['Active', 'Lead', 'Inactive']

export const CONTACT_SEED: Contact[] = [
  ...CONTACT_CORE,
  ...Array.from({ length: 16 }, (_, index) => {
    const i = index + 9
    const base = CONTACT_CORE[i % 8]
    return {
      id: `c${i}`,
      name: `${base.name.split(' ')[0]} ${SURNAMES[i % 5]}`,
      title: base.title,
      company: COMPANY_SEED[i % 6].name,
      email: `contact${i}@example.com`,
      phone: `+1 555 ${100 + i} 00${i % 9}`,
      status: STATUSES[i % 3],
      owner: OWNERS[i % 3],
      lastActivity: `${(i % 6) + 1}d ago`,
      dealValue: ((i * 731) % 22000) + 2000,
    }
  }),
]

export const DEAL_SEED: Deal[] = [
  {
    id: 'd1',
    name: 'Enterprise Platform',
    company: 'Acme Corporation',
    value: 24500,
    prob: 75,
    stage: 'Negotiation',
    owner: 'Sarah Johnson',
    next: 'Follow-up tomorrow',
    due: 'Aug 10',
  },
  {
    id: 'd2',
    name: 'Data Warehouse Migration',
    company: 'Nova Labs',
    value: 18300,
    prob: 55,
    stage: 'Proposal',
    owner: 'Mike Chen',
    next: 'Send proposal',
    due: 'Aug 12',
  },
  {
    id: 'd3',
    name: 'Analytics Suite Renewal',
    company: 'Bright Analytics',
    value: 18200,
    prob: 90,
    stage: 'Won',
    owner: 'Mike Chen',
    next: 'Kickoff call',
    due: 'Aug 9',
  },
  {
    id: 'd4',
    name: 'Retail POS Rollout',
    company: 'Cedar & Co.',
    value: 15400,
    prob: 40,
    stage: 'Qualified',
    owner: 'Ahmed Gouda',
    next: 'Discovery call',
    due: 'Aug 14',
  },
  {
    id: 'd5',
    name: 'Freight Tracking Add-on',
    company: 'Orbit Freight',
    value: 9600,
    prob: 20,
    stage: 'Lead',
    owner: 'Sarah Johnson',
    next: 'Intro email',
    due: 'Aug 16',
  },
  {
    id: 'd6',
    name: 'Brand Refresh Package',
    company: 'Lumen Studio',
    value: 6200,
    prob: 60,
    stage: 'Proposal',
    owner: 'Mike Chen',
    next: 'Review feedback',
    due: 'Aug 11',
  },
  {
    id: 'd7',
    name: 'Security Add-on',
    company: 'Acme Corporation',
    value: 12100,
    prob: 65,
    stage: 'Negotiation',
    owner: 'Ahmed Gouda',
    next: 'Contract review',
    due: 'Aug 10',
  },
  {
    id: 'd8',
    name: 'API Access Tier',
    company: 'Nova Labs',
    value: 8700,
    prob: 30,
    stage: 'Lead',
    owner: 'Sarah Johnson',
    next: 'Qualify budget',
    due: 'Aug 18',
  },
  {
    id: 'd9',
    name: 'Onboarding Services',
    company: 'Cedar & Co.',
    value: 5400,
    prob: 0,
    stage: 'Lost',
    owner: 'Ahmed Gouda',
    next: '—',
    due: '—',
  },
  {
    id: 'd10',
    name: 'Support Plan Upgrade',
    company: 'Lumen Studio',
    value: 3200,
    prob: 85,
    stage: 'Won',
    owner: 'Mike Chen',
    next: 'Invoice sent',
    due: 'Aug 9',
  },
  {
    id: 'd11',
    name: 'Fleet Analytics',
    company: 'Orbit Freight',
    value: 11200,
    prob: 45,
    stage: 'Qualified',
    owner: 'Sarah Johnson',
    next: 'Demo scheduled',
    due: 'Aug 13',
  },
  {
    id: 'd12',
    name: 'Multi-site License',
    company: 'Acme Corporation',
    value: 27600,
    prob: 70,
    stage: 'Negotiation',
    owner: 'Ahmed Gouda',
    next: 'Legal review',
    due: 'Aug 15',
  },
]

export const ACTIVITY_SEED: Activity[] = [
  {
    id: 'a1',
    time: '10:42 AM',
    group: 'Today',
    kind: 'edit',
    text: [
      { text: 'Sarah Johnson', strong: true },
      { text: ' updated ' },
      { text: 'Acme Corporation', strong: true },
    ],
  },
  {
    id: 'a2',
    time: '9:30 AM',
    group: 'Today',
    kind: 'lead',
    text: [
      { text: 'Mike', strong: true },
      { text: ' added a new lead ' },
      { text: 'Cedar & Co.', strong: true },
    ],
  },
  {
    id: 'a3',
    time: '8:45 AM',
    group: 'Today',
    kind: 'move',
    text: [
      { text: 'Deal ' },
      { text: 'Security Add-on', strong: true },
      { text: ' moved to Negotiation' },
    ],
  },
  {
    id: 'a4',
    time: '7:58 AM',
    group: 'Today',
    kind: 'mail',
    text: [
      { text: 'Elena Petrova', strong: true },
      { text: ' opened your email' },
    ],
  },
  {
    id: 'a5',
    time: 'Yesterday · 4:20 PM',
    group: 'Yesterday',
    kind: 'check',
    text: [
      { text: 'John', strong: true },
      { text: ' completed a follow-up with Nova Labs' },
    ],
  },
  {
    id: 'a6',
    time: 'Yesterday · 1:05 PM',
    group: 'Yesterday',
    kind: 'call',
    text: [
      { text: 'Ahmed', strong: true },
      { text: ' logged a call with Orbit Freight' },
    ],
  },
  {
    id: 'a7',
    time: 'Yesterday · 11:10 AM',
    group: 'Yesterday',
    kind: 'win',
    text: [
      { text: 'Deal ' },
      { text: 'Analytics Suite Renewal', strong: true },
      { text: ' marked Won 🎉' },
    ],
  },
  {
    id: 'a8',
    time: 'Mon · 3:40 PM',
    group: 'This week',
    kind: 'note',
    text: [
      { text: 'Sarah', strong: true },
      { text: ' added a note to James Okafor' },
    ],
  },
]

export const TASK_SEED: Task[] = [
  {
    id: 't1',
    title: 'Send proposal to Nova Labs',
    company: 'Nova Labs',
    priority: 'High',
    due: 'Today, 2:00 PM',
    owner: 'Sarah Johnson',
    bucket: 'Today',
    done: false,
  },
  {
    id: 't2',
    title: 'Follow up on Enterprise Platform contract',
    company: 'Acme Corporation',
    priority: 'High',
    due: 'Today, 4:30 PM',
    owner: 'Ahmed Gouda',
    bucket: 'Today',
    done: false,
  },
  {
    id: 't3',
    title: 'Prep demo deck for Orbit Freight',
    company: 'Orbit Freight',
    priority: 'Medium',
    due: 'Today, 5:00 PM',
    owner: 'Sarah Johnson',
    bucket: 'Today',
    done: false,
  },
  {
    id: 't4',
    title: 'Schedule kickoff call — Bright Analytics',
    company: 'Bright Analytics',
    priority: 'Medium',
    due: 'Aug 11',
    owner: 'Mike Chen',
    bucket: 'Upcoming',
    done: false,
  },
  {
    id: 't5',
    title: 'Renew support contract — Lumen Studio',
    company: 'Lumen Studio',
    priority: 'Low',
    due: 'Aug 14',
    owner: 'Mike Chen',
    bucket: 'Upcoming',
    done: false,
  },
  {
    id: 't6',
    title: 'Reply to Cedar & Co. pricing question',
    company: 'Cedar & Co.',
    priority: 'High',
    due: 'Aug 6 (overdue)',
    owner: 'Ahmed Gouda',
    bucket: 'Overdue',
    done: false,
  },
  {
    id: 't7',
    title: 'Update CRM fields for Nova Labs',
    company: 'Nova Labs',
    priority: 'Low',
    due: 'Aug 7 (overdue)',
    owner: 'Sarah Johnson',
    bucket: 'Overdue',
    done: false,
  },
  {
    id: 't8',
    title: 'Send onboarding guide to Acme',
    company: 'Acme Corporation',
    priority: 'Medium',
    due: 'Aug 5',
    owner: 'Ahmed Gouda',
    bucket: 'Today',
    done: true,
  },
]

export const LEAD_SEED: Lead[] = [
  {
    id: 'l1',
    name: 'Priya Nair',
    source: 'Website form',
    company: 'Orbit Freight',
    score: 82,
    status: 'New',
    created: '2h ago',
  },
  {
    id: 'l2',
    name: 'Tom Richter',
    source: 'Referral',
    company: 'Lumen Studio',
    score: 64,
    status: 'Contacted',
    created: '1d ago',
  },
  {
    id: 'l3',
    name: 'Grace Kim',
    source: 'LinkedIn',
    company: 'Meridian Health',
    score: 91,
    status: 'Qualified',
    created: '2d ago',
  },
  {
    id: 'l4',
    name: 'Ola Adebayo',
    source: 'Webinar',
    company: 'Solstice Foods',
    score: 47,
    status: 'New',
    created: '3d ago',
  },
  {
    id: 'l5',
    name: 'Hannah Weiss',
    source: 'Cold outreach',
    company: 'Fenwick & Sons',
    score: 58,
    status: 'Contacted',
    created: '4d ago',
  },
]

export const CONVERSATION_SEED: Conversation[] = [
  {
    id: 'i1',
    name: 'Sarah Johnson',
    company: 'Acme Corporation',
    subject: 'Re: Enterprise Platform contract',
    preview: "Sounds good, let's finalize Thursday. I'll loop in legal on our side.",
    time: '10:42 AM',
    unread: true,
    cat: 'customers',
    body: [
      { text: 'Hi Ahmed,' },
      {
        text: "Thanks for sending over the updated terms. Sounds good, let's finalize Thursday — I'll loop in legal on our side so we can sign by end of week.",
      },
      {
        text: 'One question: can we get the onboarding call scheduled for the following Monday?',
      },
      { text: 'Best, Sarah' },
    ],
    messages: [
      {
        id: 'i1-m1',
        from: 'Sarah Johnson',
        time: 'Yesterday · 5:12 PM',
        own: false,
        body: [
          { text: 'Hi Ahmed,' },
          {
            text: "Thanks for sending over the updated terms. Sounds good, let's finalize Thursday — I'll loop in legal on our side so we can sign by end of week.",
          },
          {
            text: 'One question: can we get the onboarding call scheduled for the following Monday?',
          },
          { text: 'Best, Sarah' },
        ],
      },
    ],
  },
  {
    id: 'i2',
    name: 'Michael Brown',
    company: 'Nova Labs',
    subject: 'Demo reschedule request',
    preview: 'Can we push the demo to next week? Something came up on our end.',
    time: '9:15 AM',
    unread: true,
    cat: 'customers',
    body: [
      { text: 'Hey there,' },
      {
        text: "Can we push the demo to next week? Something came up on our end and the team won't be able to make Thursday.",
      },
      { text: 'Would Tuesday at 2pm work instead?' },
      { text: 'Thanks, Michael' },
    ],
    messages: [
      {
        id: 'i2-m1',
        from: 'Michael Brown',
        time: 'Today · 9:15 AM',
        own: false,
        body: [
          { text: 'Hey there,' },
          {
            text: "Can we push the demo to next week? Something came up on our end and the team won't be able to make Thursday.",
          },
          { text: 'Would Tuesday at 2pm work instead?' },
          { text: 'Thanks, Michael' },
        ],
      },
    ],
  },
  {
    id: 'i3',
    name: 'Elena Petrova',
    company: 'Bright Analytics',
    subject: 'Renewal confirmation',
    preview: 'Confirming the renewal for Analytics Suite — invoice received.',
    time: 'Yesterday',
    unread: false,
    cat: 'customers',
    body: [
      { text: 'Hello,' },
      {
        text: "Confirming the renewal for the Analytics Suite — we've received the invoice and payment will be processed this week.",
      },
      { text: 'Thanks for the smooth process!' },
      { text: 'Elena' },
    ],
    messages: [
      {
        id: 'i3-m1',
        from: 'Elena Petrova',
        time: 'Yesterday · 2:30 PM',
        own: false,
        body: [
          { text: 'Hello,' },
          {
            text: "Confirming the renewal for the Analytics Suite — we've received the invoice and payment will be processed this week.",
          },
          { text: 'Thanks for the smooth process!' },
          { text: 'Elena' },
        ],
      },
    ],
  },
  {
    id: 'i4',
    name: '#deals-team',
    company: 'Internal',
    subject: '@Ahmed you were mentioned',
    preview: 'Mike: @Ahmed can you review the Cedar & Co. pricing before EOD?',
    time: 'Yesterday',
    unread: false,
    cat: 'mentions',
    body: [
      {
        text: 'Mike: @Ahmed can you review the Cedar & Co. pricing before EOD? Want to send it out first thing tomorrow.',
      },
    ],
    messages: [
      {
        id: 'i4-m1',
        from: 'Mike Chen',
        time: 'Yesterday · 4:05 PM',
        own: false,
        body: [
          {
            text: 'Mike: @Ahmed can you review the Cedar & Co. pricing before EOD? Want to send it out first thing tomorrow.',
          },
        ],
      },
    ],
  },
  {
    id: 'i5',
    name: 'James Okafor',
    company: 'Cedar & Co.',
    subject: 'Question about POS rollout timeline',
    preview: "What's a realistic go-live date if we sign this month?",
    time: '2 days ago',
    unread: false,
    cat: 'customers',
    body: [
      { text: 'Hi,' },
      {
        text: "What's a realistic go-live date if we sign this month? Trying to plan our Q4 around it.",
      },
      { text: 'James' },
    ],
    messages: [
      {
        id: 'i5-m1',
        from: 'James Okafor',
        time: '2 days ago · 11:20 AM',
        own: false,
        body: [
          { text: 'Hi,' },
          {
            text: "What's a realistic go-live date if we sign this month? Trying to plan our Q4 around it.",
          },
          { text: 'James' },
        ],
      },
    ],
  },
]

export const AUTOMATION_SEED: Automation[] = [
  {
    id: 'au1',
    name: 'Lead auto-assignment',
    desc: 'Route new leads to the right rep by territory and workload.',
    icon: 'lead',
    on: true,
  },
  {
    id: 'au2',
    name: 'Follow-up reminders',
    desc: 'Nudge owners when a deal has no activity for 5 days.',
    icon: 'move',
    on: true,
  },
  {
    id: 'au3',
    name: 'Deal stage emails',
    desc: 'Send templated emails automatically when a deal changes stage.',
    icon: 'mail',
    on: false,
  },
  {
    id: 'au4',
    name: 'Renewal alerts',
    desc: 'Flag contracts 30 days before renewal date.',
    icon: 'note',
    on: true,
  },
  {
    id: 'au5',
    name: 'Slack deal-won pings',
    desc: 'Post a celebration message when a deal is marked Won.',
    icon: 'win',
    on: true,
  },
  {
    id: 'au6',
    name: 'Weekly digest',
    desc: 'Send managers a Monday summary of pipeline changes.',
    icon: 'edit',
    on: false,
  },
]

export const INTEGRATION_SEED: Integration[] = [
  {
    id: 'in1',
    name: 'Gmail',
    desc: 'Sync email threads and log activity automatically.',
    connected: true,
  },
  {
    id: 'in2',
    name: 'Google Calendar',
    desc: 'Two-way sync for meetings and follow-ups.',
    connected: true,
  },
  {
    id: 'in3',
    name: 'Slack',
    desc: 'Get deal and task notifications in your channels.',
    connected: true,
  },
  {
    id: 'in4',
    name: 'Zoom',
    desc: 'Auto-create meeting links for scheduled calls.',
    connected: false,
  },
  {
    id: 'in5',
    name: 'Stripe',
    desc: 'Track invoices and payment status on deals.',
    connected: false,
  },
  {
    id: 'in6',
    name: 'Zapier',
    desc: 'Connect NEXA to 5,000+ apps.',
    connected: false,
  },
]

export const NOTIFICATION_SEED: Notification[] = [
  {
    id: 'n1',
    time: '4 min ago',
    read: false,
    tone: 'info',
    text: [
      { text: 'Sarah Johnson replied to your email about ' },
      { text: 'Enterprise Platform', strong: true },
      { text: '.' },
    ],
  },
  {
    id: 'n2',
    time: '1 hr ago',
    read: false,
    tone: 'success',
    text: [
      { text: 'Deal won: ', strong: true },
      { text: 'Bright Analytics — $18,200.' },
    ],
  },
  {
    id: 'n3',
    time: '3 hr ago',
    read: false,
    tone: 'warning',
    text: [
      { text: 'Follow-up with ' },
      { text: 'Nova Labs', strong: true },
      { text: ' is due tomorrow.' },
    ],
  },
  {
    id: 'n4',
    time: 'Yesterday',
    read: false,
    tone: 'info',
    text: [
      { text: 'Mike added a new lead: ' },
      { text: 'Cedar & Co.', strong: true },
    ],
  },
]

export const MESSAGE_SEED: Message[] = [
  {
    id: 'm1',
    name: 'Sarah Johnson',
    preview: "Sounds good, let's finalize Thursday.",
    time: '10:42 AM',
    read: false,
  },
  {
    id: 'm2',
    name: 'Michael Brown',
    preview: 'Can we push the demo to next week?',
    time: '9:15 AM',
    read: false,
  },
]

export const CALENDAR_SEED: CalendarEvent[] = [
  { id: 'e1', day: 3, title: 'Call — Nova Labs', kind: 'call' },
  { id: 'e2', day: 5, title: 'Deadline: Renewal', kind: 'deadline' },
  { id: 'e3', day: 9, title: 'Demo — Orbit Freight', kind: 'meeting' },
  { id: 'e4', day: 9, title: 'Follow-up: Cedar', kind: 'followup' },
  { id: 'e5', day: 10, title: 'Contract sign — Acme', kind: 'deadline' },
  { id: 'e6', day: 12, title: 'Proposal call', kind: 'meeting' },
  { id: 'e7', day: 14, title: 'Discovery — Cedar & Co.', kind: 'meeting' },
  { id: 'e8', day: 18, title: 'Kickoff — Bright', kind: 'meeting' },
  { id: 'e9', day: 18, title: 'Call — Lumen', kind: 'call' },
  { id: 'e10', day: 21, title: 'QBR — Acme', kind: 'meeting' },
  { id: 'e11', day: 27, title: 'Follow-up: Nova', kind: 'followup' },
]

export const REVENUE_SERIES = [
  { label: '7D', labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  {
    label: '30D',
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
  },
  {
    label: '90D',
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
  },
  {
    label: '12M',
    labels: [
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
    ],
  },
] as const

export const REVENUE_BASE = [38, 52, 44, 61, 58, 74]
export const WON_BASE = [20, 30, 26, 38, 34, 46]
export const LOST_BASE = [8, 6, 10, 7, 9, 5]

export const REPORT_WON = [6, 8, 7, 10, 9, 12]
export const REPORT_LOST = [2, 3, 2, 4, 2, 3]
export const REPORT_MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']

export const LEAD_SOURCES = [
  { label: 'Website', value: 38, color: '#4C7DFF' },
  { label: 'Referral', value: 26, color: '#8B6CFF' },
  { label: 'LinkedIn', value: 22, color: '#2FD498' },
  { label: 'Cold outreach', value: 14, color: '#F5B94A' },
] as const

export const FUNNEL_STAGES = [
  { label: 'Leads', value: 126 },
  { label: 'Qualified', value: 84 },
  { label: 'Proposal', value: 52 },
  { label: 'Negotiation', value: 34 },
  { label: 'Won', value: 20 },
] as const
