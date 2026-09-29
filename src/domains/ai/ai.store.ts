import { create } from 'zustand'

export type AiMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
}

type AiState = {
  open: boolean
  messages: AiMessage[]
  setOpen: (open: boolean) => void
  toggle: () => void
  ask: (question: string) => void
  reset: () => void
}

const GREETING: AiMessage = {
  id: 'm0',
  role: 'assistant',
  text: 'How can I help with your pipeline today?',
}

let counter = 0

function answer(question: string): string {
  const q = question.toLowerCase()

  if (q.includes('summar') || q.includes('activity'))
    return 'Today so far: 2 deals moved to Negotiation, 1 new lead from Cedar & Co., and Sarah replied on the Enterprise Platform contract. 3 follow-ups are still open.'

  if (q.includes('attention') || q.includes('stale') || q.includes('risk'))
    return 'Nova Labs has gone quiet for 6 days on a $18,300 proposal, and Orbit Freight has no scheduled next step. Both are worth a nudge today.'

  if (q.includes('highest') || q.includes('value') || q.includes('opportunit'))
    return 'Your top opportunities are Multi-site License ($27,600 · Acme), Enterprise Platform ($24,500 · Acme) and Data Warehouse Migration ($18,300 · Nova Labs).'

  if (q.includes('not contacted') || q.includes('dormant'))
    return 'Priya Nair (Orbit Freight, 6d), Tom Richter (Lumen Studio, 2d) and David Kim (Nova Labs, 4d) are the longest untouched records.'

  if (q.includes('predict') || q.includes('forecast') || q.includes('revenue'))
    return 'At the current weighted pipeline, you are tracking $112,400 against a $126,400 open target — 89% coverage. Closing Security Add-on closes the gap.'

  if (q.includes('task') || q.includes('today'))
    return 'You have 3 tasks due today: send the Nova Labs proposal, follow up on the Acme contract, and prep the Orbit Freight demo deck.'

  if (q.includes('help') || q.includes('what can you'))
    return 'I can summarize activity, flag deals that need attention, rank your highest-value opportunities, find dormant contacts, or forecast revenue. Try one of the prompts above.'

  return 'I can work with contacts, deals, tasks and activity. Try "which deals need attention?" or "predict this month revenue".'
}

export const useAiStore = create<AiState>((set, get) => ({
  open: false,
  messages: [GREETING],
  setOpen: (open) => set({ open }),
  toggle: () => set({ open: !get().open }),
  ask: (question) => {
    const trimmed = question.trim()
    if (!trimmed) return
    counter += 1
    set((state) => ({
      messages: [
        ...state.messages,
        { id: `u${counter}`, role: 'user', text: trimmed },
        { id: `a${counter}`, role: 'assistant', text: answer(trimmed) },
      ],
    }))
  },
  reset: () => set({ messages: [GREETING] }),
}))
