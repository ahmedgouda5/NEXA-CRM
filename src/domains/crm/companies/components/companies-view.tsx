import { useMemo, useState } from 'react'
import { Plus, Star } from 'lucide-react'
import { toast } from 'sonner'
import { fmtMoney } from '@/shared/lib/format'
import { useNavigationStore } from '@/domains/navigation'
import { CompanyMark, MiniSearch } from '@/domains/crm/components/crm-primitives'
import { OWNERS } from '@/domains/crm/crm.data'
import { useCrmStore } from '@/domains/crm/crm.store'
import type { CompanyHealth } from '@/domains/crm/crm.types'
import { matches, totalBy } from '@/domains/crm/crm.utils'

const HEALTH_CLASS: Record<CompanyHealth, string> = {
  Healthy: 'status-active',
  'At risk': 'status-lead',
  'Needs attention': 'status-inactive',
}

export function CompaniesView() {
  const companies = useCrmStore((state) => state.companies)
  const deals = useCrmStore((state) => state.deals)
  const openCreate = useCrmStore((state) => state.openCreate)
  const favorites = useNavigationStore((state) => state.favorites)
  const toggleFavorite = useNavigationStore((state) => state.toggleFavorite)
  const [query, setQuery] = useState('')
  const [health, setHealth] = useState<'All' | CompanyHealth>('All')

  const rows = useMemo(
    () =>
      companies.filter(
        (company) =>
          matches(`${company.name} ${company.industry} ${company.owner}`, query) &&
          (health === 'All' || company.health === health),
      ),
    [companies, query, health],
  )

  const totalValue = totalBy(rows, (company) => company.value)

  return (
    <section className="view" data-active="true">
      <div className="view-header">
        <div>
          <div className="view-title">Companies</div>
          <div className="view-sub">Organizations you do business with</div>
        </div>
        <div className="view-actions">
          <button
            className="btn btn-ghost"
            onClick={() => toast(`${rows.length} accounts · ${fmtMoney(totalValue)} booked`)}
          >
            {rows.length} accounts
          </button>
          <button className="btn btn-primary" onClick={() => openCreate('company')}>
            <Plus />
            Add company
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <MiniSearch value={query} onChange={setQuery} placeholder="Search companies…" />
          <select
            className="chip"
            value={health}
            onChange={(event) => setHealth(event.target.value as 'All' | CompanyHealth)}
            aria-label="Filter by health"
          >
            <option value="All">All health</option>
            <option value="Healthy">Healthy</option>
            <option value="At risk">At risk</option>
            <option value="Needs attention">Needs attention</option>
          </select>
          <div className="topbar-spacer" />
          <span className="cell-sub">
            {OWNERS.length} owners · {fmtMoney(totalValue)} total value
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Industry</th>
                <th>Owner</th>
                <th>Open deals</th>
                <th>Total value</th>
                <th>Contacts</th>
                <th>Health</th>
                <th style={{ width: 44 }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((company) => {
                const live = deals.filter(
                  (deal) => deal.company === company.name && deal.stage !== 'Won' && deal.stage !== 'Lost',
                )
                return (
                  <tr key={company.id}>
                    <td data-label="Company">
                      <div className="cell-person">
                        <CompanyMark name={company.name} />
                        <div>
                          <div className="cell-name">{company.name}</div>
                          <div className="cell-sub">
                            {live.length > 0 ? `${live.length} live opportunities` : 'No open deals'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Industry">{company.industry}</td>
                    <td data-label="Owner">{company.owner}</td>
                    <td data-label="Open deals">{company.openDeals}</td>
                    <td data-label="Total value">{fmtMoney(company.value)}</td>
                    <td data-label="Contacts">{company.contacts}</td>
                    <td data-label="Health">
                      <span className={`status-pill ${HEALTH_CLASS[company.health]}`}>
                        {company.health}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-icon"
                        style={{ width: 28, height: 28 }}
                        aria-label="Toggle favorite"
                        onClick={() =>
                          toggleFavorite({
                            id: company.id,
                            label: company.name,
                            kind: 'company',
                            view: 'companies',
                          })
                        }
                      >
                        <Star
                          style={{
                            width: 14,
                            height: 14,
                            color: favorites.some((item) => item.id === company.id)
                              ? 'var(--warning)'
                              : undefined,
                            fill: favorites.some((item) => item.id === company.id)
                              ? 'var(--warning)'
                              : 'none',
                          }}
                        />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">No companies match that search.</div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="table-foot">
          <span>Showing {rows.length} of {companies.length}</span>
          <span>Synced 4 minutes ago</span>
        </div>
      </div>
    </section>
  )
}
