import { Bell, Command, LogOut, Menu, MessageSquare, Plus, Search, User } from 'lucide-react'
import { toast } from 'sonner'
import { AvatarChip, RichBody } from '@/domains/crm/components/crm-primitives'
import { useCrmStore } from '@/domains/crm/crm.store'
import { useNavigationStore } from '@/domains/navigation'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'

const TONE: Record<'info' | 'success' | 'warning', string> = {
  info: 'var(--accent-blue)',
  success: 'var(--success)',
  warning: 'var(--warning)',
}

export function Topbar() {
  const setCommandOpen = useNavigationStore((state) => state.setCommandOpen)
  const setMobileNavOpen = useNavigationStore((state) => state.setMobileNavOpen)
  const notifications = useCrmStore((state) => state.notifications)
  const messages = useCrmStore((state) => state.messages)
  const openCreate = useCrmStore((state) => state.openCreate)
  const markNotificationsRead = useCrmStore((state) => state.markNotificationsRead)
  const markMessagesRead = useCrmStore((state) => state.markMessagesRead)

  const unreadNotifications = notifications.filter((item) => !item.read).length
  const unreadMessages = messages.filter((item) => !item.read).length

  return (
    <header className="topbar">
      <button
        type="button"
        className="hamburger"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open navigation"
      >
        <Menu />
      </button>

      <button
        type="button"
        className="search-shell"
        onClick={() => setCommandOpen(true)}
        aria-label="Search"
      >
        <Search />
        <span>Search contacts, companies, deals…</span>
        <kbd className="kbd">
          <Command style={{ width: 10, height: 10 }} />K
        </kbd>
      </button>

      <div className="topbar-spacer" />

      <div className="topbar-actions">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          id="quickAddBtn"
          onClick={() => openCreate('deal')}
        >
          <Plus />
          <span>Add</span>
        </button>

        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <button type="button" className="btn-icon" aria-label="Notifications">
                  <Bell />
                  {unreadNotifications > 0 ? <span className="dot" /> : null}
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
          <PopoverContent align="end" className="dropdown-panel">
            <div className="dd-head">
              <span>Notifications</span>
              <button
                type="button"
                className="chip"
                style={{ height: 26, padding: '0 8px', fontSize: 11 }}
                onClick={markNotificationsRead}
              >
                Mark all read
              </button>
            </div>
            {notifications.map((notification) => (
              <button
                type="button"
                className="dd-item"
                key={notification.id}
                onClick={markNotificationsRead}
              >
                <span
                  className="dd-dot"
                  style={{ background: TONE[notification.tone], opacity: notification.read ? 0.3 : 1 }}
                />
                <span className="dd-text">
                  <RichBody parts={notification.text} />
                  <span className="dd-time" style={{ display: 'block' }}>
                    {notification.time}
                  </span>
                </span>
              </button>
            ))}
            {notifications.length === 0 ? (
              <div className="empty-state">You are all caught up.</div>
            ) : null}
          </PopoverContent>
        </Popover>

        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <button type="button" className="btn-icon" aria-label="Messages">
                  <MessageSquare />
                  {unreadMessages > 0 ? <span className="dot" /> : null}
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>Messages</TooltipContent>
          </Tooltip>
          <PopoverContent align="end" className="dropdown-panel">
            <div className="dd-head">
              <span>Messages</span>
              <button
                type="button"
                className="chip"
                style={{ height: 26, padding: '0 8px', fontSize: 11 }}
                onClick={markMessagesRead}
              >
                Mark all read
              </button>
            </div>
            {messages.map((message) => (
              <button
                type="button"
                className="dd-item"
                key={message.id}
                onClick={markMessagesRead}
              >
                <AvatarChip seed={message.name} name={message.name} />
                <span className="dd-text">
                  <b>{message.name}</b>
                  <span className="dd-time" style={{ display: 'block' }}>
                    {message.preview}
                  </span>
                </span>
                <span className="dd-time" style={{ marginLeft: 'auto', marginTop: 0 }}>
                  {message.time}
                </span>
              </button>
            ))}
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="avatar-btn" aria-label="Account menu">
              <AvatarChip seed="Ahmed Gouda" name="Ahmed Gouda" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Ahmed Gouda</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => toast('Profile settings opened')}>
              <User />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast('Workspace settings opened')}>
              Workspace
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => toast('Signed out')}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
