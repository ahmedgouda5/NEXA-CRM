import { useMemo, useState } from 'react'
import { Flame, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { MiniSearch } from '@/domains/crm/components/crm-primitives'
import { useCrmStore } from '@/domains/crm/crm.store'
import type { LeadSource, LeadStatus } from '@/domains/crm/crm.types'
import { matches } from '@/domains/crm/crm.utils'

const SOURCES: LeadSource[] = [
  'Website form',
  'Referral',
  'LinkedIn',
  'Webinar',
  'Cold outreach',
]

function scoreTone(score: number) {
  if (score >= 80) return 'status-active'
  if (score >= 55) return 'status-lead'
  return 'status-inactive'
}

function statusToPill(status: LeadStatus) {
  if (status === 'Qualified') return 'status-active' as const
  if (status === 'Contacted') return 'status-lead' as const
  return 'status-inactive' as const
}

export function LeadsView() {
  const leads = useCrmStore((state) => state.leads)
  const openCreate = useCrmStore((state) => state.openCreate)
  const [query, setQuery] = useState('')
  const [source, setSource] = useState<'All' | LeadSource>('All')
  const [status, setStatus] = useState<'All' | LeadStatus>('All')

  const rows = useMemo(
    () =>
      leads.filter(
        (lead) =>
          matches(`${lead.name} ${lead.company}`, query) &&
          (source === 'All' || lead.source === source) &&
          (status === 'All' || lead.status === status),
      ),
    [leads, query, source, status],
  )

  return (
    <section className="view" data-active="true">
      <div className="view-header">
        <div>
          <div className="view-title">Leads</div>
          <div className="view-sub">Unqualified prospects awaiting review</div>
        </div>
        <div className="view-actions">
          <button
            className="btn btn-ghost"
            onClick={() => toast(`Average lead score: ${Math.round(rows.reduce((sum, lead) => sum + lead.score, 0) / (rows.length || 1))}`)}
          >
            <Flame />
            Hot leads
          </button>
          <button className="btn btn-primary" onClick={() => openCreate('lead')}>
            <Plus />
            New lead
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <MiniSearch value={query} onChange={setQuery} placeholder="Search leads…" />
          <select
            className="chip"
            value={source}
            onChange={(event) => setSource(event.target.value as 'All' | LeadSource)}
            aria-label="Filter by source"
          >
            <option value="All">All sources</option>
            {SOURCES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className="chip"
            value={status}
            onChange={(event) => setStatus(event.target.value as 'All' | LeadStatus)}
            aria-label="Filter by status"
          >
            <option value="All">All statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
          </select>
          <div className="topbar-spacer" />
          <span className="cell-sub">{rows.length} leads</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Source</th>
                <th>Company</th>
                <th>Score</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((lead) => (
                <tr key={lead.id}>
                  <td data-label="Name">
                    <div className="cell-name">{lead.name}</div>
                  </td>
                  <td data-label="Source">{lead.source}</td>
                  <td data-label="Company">{lead.company}</td>
                  <td data-label="Score">
                    <span className={`status-pill ${scoreTone(lead.score)}`}>{lead.score}</span>
                  </td>
                  <td data-label="Status">
                    <span className={`status-pill ${statusToPill(lead.status)}`}>{lead.status}</span>
                  </td>
                  <td data-label="Created">{lead.created}</td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">No leads match those filters.</div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="table-foot">
          <span>Auto-assignment routes new leads by territory</span>
          <span>{rows.length} of {leads.length} shown</span>
        </div>
      </div>
    </section>
  )
}
