import { useMemo, useState } from 'react'
import { ArrowLeft, AtSign, CornerUpLeft, Hash, Send, Users } from 'lucide-react'
import { toast } from 'sonner'
import { RichBody } from '@/domains/crm/components/crm-primitives'
import { useCrmStore } from '@/domains/crm/crm.store'
import type { InboxCategory } from '@/domains/crm/crm.types'

const CATEGORIES: { key: InboxCategory; label: string; icon: typeof AtSign }[] = [
  { key: 'all', label: 'All', icon: AtSign },
  { key: 'mentions', label: 'Mentions', icon: Hash },
  { key: 'customers', label: 'Customers', icon: Users },
]

export function InboxView() {
  const conversations = useCrmStore((state) => state.conversations)
  const category = useCrmStore((state) => state.inboxCategory)
  const setCategory = useCrmStore((state) => state.setInboxCategory)
  const activeId = useCrmStore((state) => state.activeConversationId)
  const openConversation = useCrmStore((state) => state.openConversation)
  const closeConversation = useCrmStore((state) => state.closeConversation)
  const reply = useCrmStore((state) => state.replyToConversation)
  const [draft, setDraft] = useState('')

  const active = conversations.find((item) => item.id === activeId)

  const rows = useMemo(
    () =>
      conversations.filter((item) => {
        if (category === 'all') return true
        if (category === 'mentions') return item.cat === 'mentions'
        return item.cat === category
      }),
    [conversations, category],
  )

  const unread = conversations.filter((item) => item.unread).length

  function send() {
    if (!draft.trim() || !active) return
    reply(draft.trim())
    setDraft('')
    toast.success('Reply sent')
  }

  return (
    <section className="view" data-active="true">
      <div className="view-header">
        <div>
          <div className="view-title">Inbox</div>
          <div className="view-sub">Every customer conversation, unified</div>
        </div>
        <div className="view-actions">
          <span className="cell-sub">{unread} unread</span>
        </div>
      </div>

      <div className="inbox-shell" data-thread={active ? 'open' : 'closed'}>
        <div className="inbox-col-1">
          {CATEGORIES.map((item) => {
            const count = conversations.filter((conversation) =>
              item.key === 'all'
                ? true
                : item.key === 'mentions'
                  ? conversation.cat === 'mentions'
                  : conversation.cat === item.key,
            ).length
            const Icon = item.icon
            return (
              <button
                type="button"
                key={item.key}
                className={category === item.key ? 'inbox-cat active' : 'inbox-cat'}
                onClick={() => setCategory(item.key)}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Icon style={{ width: 14, height: 14 }} />
                  {item.label}
                </span>
                <span className="cell-sub">{count}</span>
              </button>
            )
          })}
        </div>

        <div className="inbox-col-2">
          {rows.map((conversation) => (
            <button
              type="button"
              key={conversation.id}
              className={
                conversation.id === activeId
                  ? `conv-item active${conversation.unread ? ' conv-unread' : ''}`
                  : `conv-item${conversation.unread ? ' conv-unread' : ''}`
              }
              onClick={() => openConversation(conversation.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                background: 'none',
                font: 'inherit',
                color: 'inherit',
              }}
            >
              <div className="conv-top">
                <span className="conv-name">{conversation.name}</span>
                <span className="conv-time">{conversation.time}</span>
              </div>
              <div className="conv-subj">{conversation.subject}</div>
              <div className="conv-prev">{conversation.preview}</div>
            </button>
          ))}
          {rows.length === 0 ? (
            <div className="empty-state">Nothing here yet.</div>
          ) : null}
        </div>

        <div className="inbox-col-3">
          {active ? (
            <>
              <div className="thread-head">
                <button
                  type="button"
                  className="thread-back"
                  onClick={closeConversation}
                  aria-label="Back to conversations"
                >
                  <ArrowLeft style={{ width: 15, height: 15 }} />
                </button>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{active.name}</div>
                  <div className="cell-sub">{active.subject}</div>
                </div>
              </div>
              <div className="thread-body">
                {active.messages.map((message) => (
                  <div className="msg-bubble" key={message.id}>
                    <div className="msg-meta">
                      <b style={{ color: 'var(--text)' }}>{message.from}</b>
                      <span>{message.time}</span>
                    </div>
                    <RichBody parts={message.body} />
                  </div>
                ))}
              </div>
              <div className="thread-reply">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={`Reply to ${active.name}…`}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) send()
                  }}
                />
                <button
                  type="button"
                  className="ai-send"
                  onClick={send}
                  aria-label="Send reply"
                  style={{ position: 'static' }}
                >
                  <CornerUpLeft />
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ margin: 'auto' }}>
              <Send style={{ width: 22, height: 22, marginBottom: 8 }} />
              <div>Select a conversation to read the thread.</div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
