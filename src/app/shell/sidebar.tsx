import { Moon, Settings, Sun } from 'lucide-react'
import { toast } from 'sonner'
import { AvatarChip } from '@/domains/crm/components/crm-primitives'
import { useCrmStore } from '@/domains/crm/crm.store'
import { NAV_GROUPS, useNavigationStore } from '@/domains/navigation'
import { useTheme } from '@/shared/theme/theme-provider'

export function Sidebar() {
  const activeView = useNavigationStore((state) => state.activeView)
  const setView = useNavigationStore((state) => state.setView)
  const rail = useNavigationStore((state) => state.rail)
  const toggleRail = useNavigationStore((state) => state.toggleRail)
  const mobileNavOpen = useNavigationStore((state) => state.mobileNavOpen)
  const setMobileNavOpen = useNavigationStore((state) => state.setMobileNavOpen)
  const favorites = useNavigationStore((state) => state.favorites)
  const openContact = useCrmStore((state) => state.openContact)
  const unread = useCrmStore((state) => state.conversations.filter((item) => item.unread).length)
  const { theme, setTheme } = useTheme()

  return (
    <>
      <button
        type="button"
        className={mobileNavOpen ? 'overlay show' : 'overlay'}
        aria-label="Close navigation"
        tabIndex={mobileNavOpen ? 0 : -1}
        onClick={() => setMobileNavOpen(false)}
      />
      <aside
        className={[
          'sidebar',
          rail ? 'rail' : '',
          mobileNavOpen ? 'open' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        data-rail={rail ? 'true' : 'false'}
      >
        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={toggleRail}
          aria-label={rail ? 'Expand sidebar' : 'Collapse sidebar'}
          title={rail ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Chevron />
        </button>

        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path
                d="M4 20V4l16 16V4"
                stroke="white"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-name">NEXA CRM</div>
            <div className="brand-tag">organized intelligently</div>
          </div>
        </div>

        <button
          type="button"
          className="workspace-switch"
          onClick={() => toast('Workspace switcher — 1 workspace available')}
          title="Acme Growth Co. — Pro workspace"
        >
          <div className="ws-avatar">AC</div>
          <div className="ws-name">
            Acme Growth Co.
            <small>Pro workspace</small>
          </div>
          <svg
            className="ws-chevron"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <path d="M8 9l4-4 4 4M8 15l4 4 4-4" />
          </svg>
        </button>

        <nav className="nav-scroll" aria-label="Primary">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="nav-label">{group.label}</div>
              {group.items.map((item) => {
                const Icon = item.icon
                const badge =
                  item.id === 'inbox' && unread > 0 ? String(unread) : (item.badge ?? undefined)
                return (
                  <button
                    type="button"
                    key={item.id}
                    className="nav-item"
                    data-active={activeView === item.id ? 'true' : 'false'}
                    onClick={() => setView(item.id)}
                    title={item.label}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                    {badge ? <span className="nav-badge">{badge}</span> : null}
                  </button>
                )
              })}
            </div>
          ))}

          <div className="nav-label">Favorites</div>
          {favorites.map((favorite) => (
            <button
              type="button"
              className="fav-item"
              key={favorite.id}
              title={favorite.label}
              onClick={() => {
                if (favorite.kind === 'contact') openContact(favorite.id)
                else if (favorite.kind === 'company') setView(favorite.view)
                else setView(favorite.view)
              }}
            >
              <span className="fav-dot">{favorite.label.charAt(0)}</span>
              <span>{favorite.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="profile-row"
            onClick={() => toast('Profile — Ahmed Gouda, Sales Manager')}
          >
            <AvatarChip seed="Ahmed Gouda" name="Ahmed Gouda" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="profile-name">Ahmed Gouda</div>
              <div className="profile-role">Sales Manager</div>
            </div>
          </button>
          <div className="foot-links">
            <button
              type="button"
              className="foot-link"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun style={{ width: 13, height: 13 }} /> : <Moon style={{ width: 13, height: 13 }} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <button
              type="button"
              className="foot-link"
              onClick={() => toast('Settings — preferences, members and billing')}
            >
              <Settings style={{ width: 13, height: 13 }} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}
