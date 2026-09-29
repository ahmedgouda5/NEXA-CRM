import { useEffect, useRef, useState } from 'react'
import { RefreshCw, Send, Sparkles, X } from 'lucide-react'
import { toast } from 'sonner'
import { useAiStore } from '../ai.store'

const PROMPTS = [
  "Summarize today's sales activity",
  'Which deals need attention?',
  'Show my highest-value opportunities',
  "Find customers I haven't contacted recently",
  "Predict this month's revenue",
]

export function AiAssistant() {
  const open = useAiStore((state) => state.open)
  const messages = useAiStore((state) => state.messages)
  const toggle = useAiStore((state) => state.toggle)
  const ask = useAiStore((state) => state.ask)
  const reset = useAiStore((state) => state.reset)
  const [draft, setDraft] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages, open])

  function send() {
    if (!draft.trim()) return
    ask(draft)
    setDraft('')
  }

  return (
    <>
      <button
        type="button"
        className="ai-fab"
        onClick={toggle}
        aria-label={open ? 'Close Nexa AI' : 'Open Nexa AI'}
      >
        <Sparkles style={{ width: 24, height: 24 }} />
      </button>

      <div className={open ? 'ai-panel show' : 'ai-panel'} role="dialog" aria-label="Nexa AI">
        <div className="ai-head">
          <div className="ai-head-icon">
            <Sparkles />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13.5 }}>Nexa AI</div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Your CRM copilot</div>
          </div>
          <button
            type="button"
            className="drawer-close"
            style={{ marginLeft: 'auto' }}
            onClick={reset}
            aria-label="Reset conversation"
          >
            <RefreshCw />
          </button>
          <button
            type="button"
            className="drawer-close"
            onClick={toggle}
            aria-label="Close Nexa AI"
          >
            <X />
          </button>
        </div>

        <div className="ai-body" ref={bodyRef}>
          {messages.map((message) => (
            <div className={message.role === 'user' ? 'ai-msg user' : 'ai-msg'} key={message.id}>
              {message.text}
            </div>
          ))}
          {messages.length === 1 ? (
            <div className="ai-prompts">
              {PROMPTS.map((prompt) => (
                <button
                  type="button"
                  className="ai-prompt-btn"
                  key={prompt}
                  onClick={() => {
                    ask(prompt)
                    toast('Asking Nexa AI…')
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="ai-input-row">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') send()
            }}
            placeholder="Ask Nexa AI anything…"
            aria-label="Ask Nexa AI"
          />
          <button type="button" className="ai-send" onClick={send} aria-label="Send">
            <Send />
          </button>
        </div>
      </div>
    </>
  )
}
