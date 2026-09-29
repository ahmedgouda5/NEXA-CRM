import { useMemo, useState } from 'react'
import { Funnel, Plus, Rows3, Star } from 'lucide-react'
import { toast } from 'sonner'
import { fmtMoney } from '@/shared/lib/format'
import { useNavigationStore } from '@/domains/navigation'
import {
  AvatarChip,
  MiniSearch,
  Pager,
  SortHeader,
  StatusPill,
} from '@/domains/crm/components/crm-primitives'
import { OWNERS } from '@/domains/crm/crm.data'
import { useCrmStore } from '@/domains/crm/crm.store'
import type { Contact } from '@/domains/crm/crm.types'
import { matches, sortBy } from '@/domains/crm/crm.utils'

type Column = 'name' | 'company' | 'email' | 'status' | 'lastActivity' | 'dealValue'
type OwnerFilter = 'All' | (typeof OWNERS)[number]
type StatusFilter = 'All' | Contact['status']

const PAGE_SIZE = 8

export function ContactsView() {
  const contacts = useCrmStore((state) => state.contacts)
  const openCreate = useCrmStore((state) => state.openCreate)
  const openContact = useCrmStore((state) => state.openContact)
  const favorites = useNavigationStore((state) => state.favorites)
  const toggleFavorite = useNavigationStore((state) => state.toggleFavorite)

  const [query, setQuery] = useState('')
  const [column, setColumn] = useState<Column>('name')
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc')
  const [owner, setOwner] = useState<OwnerFilter>('All')
  const [status, setStatus] = useState<StatusFilter>('All')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])

  const rows = useMemo(() => {
    const filtered = contacts.filter(
      (contact) =>
        matches(`${contact.name} ${contact.email} ${contact.company}`, query) &&
        (owner === 'All' || contact.owner === owner) &&
        (status === 'All' || contact.status === status),
    )
    return sortBy(filtered, column, direction)
  }, [contacts, query, column, direction, owner, status])

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const visible = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  function onSort(next: Column) {
    if (next === column) setDirection(direction === 'asc' ? 'desc' : 'asc')
    else {
      setColumn(next)
      setDirection('asc')
    }
    setPage(1)
  }

  function toggleRow(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <section className="view" data-active="true">
      <div className="view-header">
        <div>
          <div className="view-title">Contacts</div>
          <div className="view-sub">All people across your workspace</div>
        </div>
        <div className="view-actions">
          <button className="btn btn-primary" onClick={() => openCreate('contact')}>
            <Plus />
            Add contact
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <MiniSearch value={query} onChange={setQuery} placeholder="Search contacts…" />
          <select
            className="chip"
            value={owner}
            onChange={(event) => setOwner(event.target.value as OwnerFilter)}
            style={{ paddingRight: 8 }}
            aria-label="Filter by owner"
          >
            <option value="All">All owners</option>
            {OWNERS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className="chip"
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            style={{ paddingRight: 8 }}
            aria-label="Filter by status"
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Lead">Lead</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            className="chip"
            onClick={() => {
              setOwner('All')
              setStatus('All')
              setQuery('')
              toast('Filters cleared')
            }}
          >
            <Funnel />
            Reset
          </button>
          <button
            className="chip"
            onClick={() => toast(`Sorted by ${column} ${direction === 'asc' ? '↑' : '↓'}`)}
          >
            <Rows3 />
            Sort
          </button>
          <div className="topbar-spacer" />
          <span className="cell-sub">
            {selected.length > 0 ? `${selected.length} selected` : `${rows.length} contacts`}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 30 }}>
                  <button
                    type="button"
                    className="checkbox"
                    aria-label="Select all on page"
                    onClick={() =>
                      setSelected(
                        selected.length === visible.length ? [] : visible.map((row) => row.id),
                      )
                    }
                    style={
                      selected.length === visible.length && visible.length > 0
                        ? { background: 'var(--accent-blue)', borderColor: 'var(--accent-blue)' }
                        : undefined
                    }
                  />
                </th>
                <SortHeader label="Name" column="name" active={column} direction={direction} onSort={onSort} />
                <SortHeader
                  label="Company"
                  column="company"
                  active={column}
                  direction={direction}
                  onSort={onSort}
                />
                <SortHeader label="Email" column="email" active={column} direction={direction} onSort={onSort} />
                <th>Phone</th>
                <SortHeader
                  label="Status"
                  column="status"
                  active={column}
                  direction={direction}
                  onSort={onSort}
                />
                <th>Owner</th>
                <SortHeader
                  label="Last activity"
                  column="lastActivity"
                  active={column}
                  direction={direction}
                  onSort={onSort}
                />
                <SortHeader
                  label="Deal value"
                  column="dealValue"
                  active={column}
                  direction={direction}
                  onSort={onSort}
                />
                <th style={{ width: 44 }} />
              </tr>
            </thead>
            <tbody>
              {visible.map((contact) => (
                <tr key={contact.id} onClick={() => openContact(contact.id)}>
                  <td onClick={(event) => event.stopPropagation()}>
                    <button
                      type="button"
                      className="checkbox"
                      aria-label={`Select ${contact.name}`}
                      aria-pressed={selected.includes(contact.id)}
                      onClick={() => toggleRow(contact.id)}
                      style={
                        selected.includes(contact.id)
                          ? { background: 'var(--accent-blue)', borderColor: 'var(--accent-blue)' }
                          : undefined
                      }
                    />
                  </td>
                  <td data-label="Name">
                    <div className="cell-person">
                      <AvatarChip seed={contact.name} name={contact.name} />
                      <div>
                        <div className="cell-name">{contact.name}</div>
                        <div className="cell-sub">{contact.title}</div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Company">{contact.company}</td>
                  <td data-label="Email">
                    <a href={`mailto:${contact.email}`} style={{ color: 'var(--accent-blue)' }}>
                      {contact.email}
                    </a>
                  </td>
                  <td data-label="Phone">{contact.phone}</td>
                  <td data-label="Status">
                    <StatusPill status={contact.status} />
                  </td>
                  <td data-label="Owner">{contact.owner}</td>
                  <td data-label="Last activity">{contact.lastActivity}</td>
                  <td data-label="Deal value">{fmtMoney(contact.dealValue)}</td>
                  <td onClick={(event) => event.stopPropagation()}>
                    <button
                      type="button"
                      className="btn-icon"
                      style={{ width: 28, height: 28 }}
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
                  </td>
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <div className="empty-state">No contacts match those filters.</div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="table-foot">
          <span>
            Showing {rows.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1}–
            {Math.min(current * PAGE_SIZE, rows.length)} of {rows.length}
          </span>
          <Pager page={current} pageCount={pageCount} onPage={setPage} />
        </div>
      </div>
    </section>
  )
}
