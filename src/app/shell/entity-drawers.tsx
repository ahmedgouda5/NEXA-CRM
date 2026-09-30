import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase,
  Building,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { fmtMoney } from '@/shared/lib/format'
import { AvatarChip, CompanyMark, StatusPill } from '@/domains/crm/components/crm-primitives'
import { STAGES } from '@/domains/crm/crm.data'
import { useCrmStore } from '@/domains/crm/crm.store'
import { stageColor } from '@/domains/crm/crm.utils'
import { useNavigationStore } from '@/domains/navigation'
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/sheet'

export function EntityDrawers() {
  const contactId = useCrmStore((state) => state.openContactId)
  const dealId = useCrmStore((state) => state.openDealId)
  const openContact = useCrmStore((state) => state.openContact)
  const openDeal = useCrmStore((state) => state.openDeal)

  const contact = useCrmStore((state) => state.contacts.find((item) => item.id === contactId))
  const deal = useCrmStore((state) => state.deals.find((item) => item.id === dealId))
  const moveDeal = useCrmStore((state) => state.moveDeal)
  const conversations = useCrmStore((state) => state.conversations)
  const openConversation = useCrmStore((state) => state.openConversation)
  const navigate = useNavigate()
  const favorites = useNavigationStore((state) => state.favorites)
  const toggleFavorite = useNavigationStore((state) => state.toggleFavorite)

  const thread = useMemo(
    () => (contact ? conversations.find((item) => item.name === contact.name) : undefined),
    [contact, conversations],
  )

  return (
    <>
      <Sheet
        open={Boolean(contact)}
        onOpenChange={(next) => {
          if (!next) openContact(null)
        }}
      >
        <SheetContent side="right" className="sheet-drawer" showCloseButton={false}>
          {contact ? (
            <>
              <div className="sheet-drawer-head">
                <span className="sheet-drawer-title">Contact</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    className="drawer-close"
                    aria-label="Toggle favorite"
                    onClick={() =>
                      toggleFavorite({
                        id: contact.id,
                        label: contact.name,
                        kind: 'contact',
                        view: 'contacts',
                      })
                    }
                  >
                    <Star
                      style={{
                        width: 14,
                        height: 14,
                        color: favorites.some((item) => item.id === contact.id)
                          ? 'var(--warning)'
                          : undefined,
                        fill: favorites.some((item) => item.id === contact.id)
                          ? 'var(--warning)'
                          : 'none',
                      }}
                    />
                  </button>
                  <button
                    type="button"
                    className="drawer-close"
                    aria-label="Close"
                    onClick={() => openContact(null)}
                  >
                    <X />
                  </button>
                </div>
              </div>

              <div className="sheet-drawer-body">
                <div className="profile-hero">
                  <AvatarChip seed={contact.name} name={contact.name} size="lg" />
                  <h2>{contact.name}</h2>
                  <p>
                    {contact.title} · {contact.company}
                  </p>
                  <div className="profile-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => toast(`Email drafted to ${contact.name}`)}
                    >
                      <Mail />
                      Email
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => toast(`Calling ${contact.name}…`)}
                    >
                      <Phone />
                      Call
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => openCreateTask(contact.name, contact.company)}
                    >
                      Task
                    </button>
                  </div>
                </div>

                <div className="info-block">
                  <h4>Details</h4>
                  <div className="info-row">
                    <Mail />
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </div>
                  <div className="info-row">
                    <Phone />
                    {contact.phone}
                  </div>
                  <div className="info-row">
                    <Building />
                    {contact.company}
                  </div>
                  <div className="info-row">
                    <User />
                    Owner: {contact.owner}
                  </div>
                  <div className="info-row">
                    <MapPin />
                    {contact.lastActivity}
                  </div>
                </div>

                <div className="info-block">
                  <h4>Status</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <StatusPill status={contact.status} />
                    <span className="cell-sub">Deal value {fmtMoney(contact.dealValue)}</span>
                  </div>
                </div>

                <div className="info-block">
                  <h4>Recent conversation</h4>
                  {thread ? (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        openContact(null)
                        navigate('/inbox')
                        openConversation(thread.id)
                      }}
                    >
                      <Mail />
                      Open thread in inbox
                    </button>
                  ) : (
                    <div className="cell-sub">No email thread with this contact yet.</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <SheetTitle className="sr-only">Contact</SheetTitle>
          )}
        </SheetContent>
      </Sheet>

      <Sheet
        open={Boolean(deal)}
        onOpenChange={(next) => {
          if (!next) openDeal(null)
        }}
      >
        <SheetContent side="right" className="sheet-drawer" showCloseButton={false}>
          {deal ? (
            <>
              <div className="sheet-drawer-head">
                <span className="sheet-drawer-title">Deal</span>
                <button
                  type="button"
                  className="drawer-close"
                  aria-label="Close"
                  onClick={() => openDeal(null)}
                >
                  <X />
                </button>
              </div>

              <div className="sheet-drawer-body">
                <div className="info-block">
                  <div className="cell-person" style={{ gap: 10 }}>
                    <CompanyMark name={deal.company} />
                    <div>
                      <div className="cell-name" style={{ fontSize: 15 }}>
                        {deal.name}
                      </div>
                      <div className="cell-sub">{deal.company}</div>
                    </div>
                  </div>
                </div>

                <div className="stat-trio">
                  <div>
                    <div className="v">{fmtMoney(deal.value)}</div>
                    <div className="k">Value</div>
                  </div>
                  <div>
                    <div className="v">{deal.prob}%</div>
                    <div className="k">Probability</div>
                  </div>
                  <div>
                    <div className="v" style={{ color: stageColor(deal.stage) }}>
                      {deal.stage}
                    </div>
                    <div className="k">Stage</div>
                  </div>
                </div>

                <div className="info-block" style={{ marginTop: 22 }}>
                  <h4>Move stage</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {STAGES.map((stage) => (
                      <button
                        type="button"
                        key={stage.key}
                        className="chip"
                        onClick={() => {
                          moveDeal(deal.id, stage.key)
                          toast(`${deal.name} → ${stage.key}`)
                        }}
                        style={
                          stage.key === deal.stage
                            ? { color: stage.color, borderColor: stage.color }
                            : undefined
                        }
                      >
                        <span className="stage-dot" style={{ background: stage.color }} />
                        {stage.key}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="info-block">
                  <h4>Next step</h4>
                  <div className="info-row">
                    <Briefcase />
                    {deal.next}
                  </div>
                  <div className="info-row">
                    <User />
                    Owner: {deal.owner}
                  </div>
                  <div className="info-row">
                    <MapPin />
                    Due: {deal.due}
                  </div>
                </div>

                <div className="info-block">
                  <h4>Weighted value</h4>
                  <div className="progress-track">
                    <div
                      className="progress-seg"
                      style={{ width: `${deal.prob}%`, background: stageColor(deal.stage) }}
                    />
                  </div>
                  <div className="stage-labels">
                    <span>0%</span>
                    <span className="current">{fmtMoney(Math.round(deal.value * (deal.prob / 100)))}</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="profile-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => toast(`Logged activity on ${deal.name}`)}
                  >
                    Log activity
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => openCreateTask(deal.name, deal.company)}
                  >
                    New task
                  </button>
                </div>
              </div>
            </>
          ) : (
            <SheetTitle className="sr-only">Deal</SheetTitle>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

function openCreateTask(title: string, company: string) {
  const store = useCrmStore.getState()
  store.addTask({ title: `Follow up: ${title}`, company, priority: 'Medium', due: 'Tomorrow' })
  toast.success('Task created')
}
